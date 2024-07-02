import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc,Id } from "./_generated/dataModel"
import { normalize } from "path";
// import { DocumentList } from '../app/(main)/_components/document-list';

export const archive = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("No autorizado");
      }
  
      const userId = identity.subject;
      const existingDocument = await ctx.db.get(args.id);
  
      if (!existingDocument) {
        throw new Error("No encontrado");
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error("No autorizado");
      }
  
      const recursiveArchive = async (documentId: Id<"documents">) => {
        const children = await ctx.db
          .query("documents")
          .withIndex("by_user_parent", (q) =>
            q.eq("userId", userId).eq("parentDocument", documentId)
          )
          .collect();
  
        for (const child of children) {
          await ctx.db.patch(child._id, {
            isArchived: true,
            isTemplate: false, // Set isTemplate to false for children as well
          });
  
          await recursiveArchive(child._id);
        }
      };
  
      const document = await ctx.db.patch(args.id, {
        isArchived: true,
        isTemplate: false, // Set isTemplate to false when archiving
      });
  
      await recursiveArchive(args.id);
  
      return document;
    },
  });

export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("No autorizado");
        }

        const userId = identity.subject;

        const documents = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => 
        q
            .eq("userId", userId)
            .eq("parentDocument", args.parentDocument)
        )
        .filter((q) =>
            q.eq(q.field("isArchived"), false)
        )
        .order("desc")
        .collect();

        return documents;
    }
});


export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not Authenticated")
        }

        const userId = identity.subject;

        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        });

        return document;
    }
})

export const getTrash = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not Authenticated")
        }

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.eq(q.field("isArchived"), true)
            )
            .order("desc")
            .collect();

            return documents;
    }
});

export const restore = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not Authenticated")
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("No encontrado")
        }

        if (existingDocument.userId !== userId) {
            throw new Error("No autorizado");
        }

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

                for (const child of children) {
                    await ctx.db.patch(child._id, {
                        isArchived: false,
                    });

                    await recursiveRestore(child._id);
                }
        }

        const options: Partial<Doc<"documents">> = {
            isArchived: false,
        };

        if (existingDocument.parentDocument) {
            const parent = await ctx.db.get(existingDocument.parentDocument);
            if (parent?.isArchived) {
                options.parentDocument = undefined;
            }
        }

        const document = await ctx.db.patch(args.id, options);

        recursiveRestore(args.id);

        return document;
    }
});

export const remove = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not Authenticated")
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("No encontrado");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("No Autorizado")
        }

        const document = await ctx.db.delete(args.id);

        return document;
    }
});


export const getSearch = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not Authenticated")
        }

        const userId = identity.subject;

        const documents = await ctx.db
        .query("documents")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => 
            q.eq(q.field("isArchived"), false),
        )
        .order("desc")
        .collect()

    return documents;
    }
});

export const getById = query({
    args: { documentId: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        const document = await ctx.db.get(args.documentId);

        if (!document) {
            throw new Error("No encontrado");
        }

        if (document.isPublished && !document.isArchived) {
            return document;
        }

        if (!identity) {
            throw new Error("No identificado")
        }

        const userId = identity.subject;

        if (document.userId !== userId) {
            throw new Error("Autorizado")
        }

        return document;
    }
});

export const update = mutation({
    args: {
        id: v.id("documents"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("No identificado")
        }

        const userId = identity.subject;

        const { id, ...rest} = args;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("No encontrado")
        }

        if (existingDocument.userId !== userId) {
            throw new Error("no autorizado");
        }

        const document = await ctx.db.patch(args.id, {
            ...rest
        });
        
        return document;
    },
});

export const removeIcon = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("No identificado")
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("No encontrado")
        }

        if (existingDocument.userId !== userId) {
            throw new Error("no autorizado");
        }

        const document = await ctx.db.patch(args.id, {
            icon: undefined
        });
        return document;
    },
}); 

export const removeCoverImage = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("No identificado")
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("No encontrado")
        }

        if (existingDocument.userId !== userId) {
            throw new Error("no autorizado");
        }

        const document = await ctx.db.patch(args.id, {
            coverImage: undefined
        });
        return document;
    },
});

// plantilla

export const convertToTemplate = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("No autorizado");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("No encontrado");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("No autorizado");
    }

    if (existingDocument.isArchived) {
      throw new Error("No se puede convertir en plantilla un documento archivado");
    }

    if (existingDocument.isTemplate) {
      throw new Error("El documento ya es una plantilla");
    }

    const document = await ctx.db.patch(args.id, {
      isTemplate: true,
    });

    return document;
  },
});

export const getTemplates = query({
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("No autorizado");
      }
  
      const userId = identity.subject;
  
      const templates = await ctx.db.query("documents")
        .filter(q => q.and(
          q.eq(q.field("isTemplate"), true),
          q.eq(q.field("userId"), userId)
        ))
        .collect();
  
      return templates;
    },
  });

export const updateDocument = mutation({
    args: {
      id: v.id("documents"),
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      coverImage: v.optional(v.string()),
      icon: v.optional(v.string()),
      isPublished: v.optional(v.boolean()),
    //   isTemplate: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("No identificado");
      }
  
      const userId = identity.subject;
      const { id, ...rest} = args;
  
      const existingDocument = await ctx.db.get(args.id);
  
      if (!existingDocument) {
        throw new Error("No encontrado");
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error("No autorizado");
      }
  
      // Actualiza el documento con los campos proporcionados
      const document = await ctx.db.patch(args.id, {
        ...rest
      });
  
      return document;
    },
  });

  // admin

  export const getUserInfo = query(async ({ db, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      throw new Error("No autorizado");
    }
  
    // Supongamos que estamos almacenando información del usuario en la tabla `documents`.
    const user = await db.query("documents")
      .filter(q => q.eq(q.field("userId"), identity.tokenIdentifier))
      .first();
  
    if (!user) {
      // Si no se encuentra el usuario, devolvemos isAdmin como falso.
      return { isAdmin: false };
    }
  
    return {
      isAdmin: user.isAdmin || false,
    };
  });