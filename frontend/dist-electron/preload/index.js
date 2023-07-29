"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const electron = require("electron");
const inversify = require("inversify");
const typeorm = require("typeorm");
const moment = require("moment");
const INJECTIONS = {
  DatabaseService: Symbol.for("DatabaseService"),
  NoteService: Symbol.for("NoteService")
};
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$3(target, key, result);
  return result;
};
let Tag = class {
  constructor() {
    __publicField(this, "id");
    __publicField(this, "name");
    __publicField(this, "notes");
    __publicField(this, "createdAt");
  }
};
__decorateClass$3([
  typeorm.PrimaryGeneratedColumn("uuid")
], Tag.prototype, "id", 2);
__decorateClass$3([
  typeorm.Column("varchar"),
  typeorm.Unique("tag_name_unique", ["name"])
], Tag.prototype, "name", 2);
__decorateClass$3([
  typeorm.ManyToMany(() => Note, (note) => note.tags)
], Tag.prototype, "notes", 2);
__decorateClass$3([
  typeorm.CreateDateColumn({
    transformer: {
      from: (date) => moment(date).valueOf(),
      to: () => new Date()
    },
    type: "datetime"
  })
], Tag.prototype, "createdAt", 2);
Tag = __decorateClass$3([
  typeorm.Entity()
], Tag);
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$2(target, key, result);
  return result;
};
let Note = class {
  constructor() {
    __publicField(this, "id");
    __publicField(this, "title");
    __publicField(this, "content");
    __publicField(this, "createdAt");
    __publicField(this, "updatedAt");
    __publicField(this, "deletedAt");
    __publicField(this, "tags");
  }
};
__decorateClass$2([
  typeorm.PrimaryGeneratedColumn("uuid")
], Note.prototype, "id", 2);
__decorateClass$2([
  typeorm.Column("varchar")
], Note.prototype, "title", 2);
__decorateClass$2([
  typeorm.Column("varchar")
], Note.prototype, "content", 2);
__decorateClass$2([
  typeorm.CreateDateColumn({
    transformer: {
      from: (date) => moment(date).valueOf(),
      to: () => new Date()
    },
    type: "datetime"
  })
], Note.prototype, "createdAt", 2);
__decorateClass$2([
  typeorm.UpdateDateColumn({
    transformer: {
      from: (date) => moment(date).valueOf(),
      to: () => new Date()
    },
    type: "datetime"
  })
], Note.prototype, "updatedAt", 2);
__decorateClass$2([
  typeorm.DeleteDateColumn({
    transformer: {
      from: (date) => date ? moment(date).valueOf() : null,
      to: (millis) => millis ? moment(millis).toDate() : null
    },
    type: "datetime"
  })
], Note.prototype, "deletedAt", 2);
__decorateClass$2([
  typeorm.ManyToMany(() => Tag, (tag) => tag.notes, {
    cascade: true,
    eager: true
  }),
  typeorm.JoinTable({
    name: "note_tag",
    joinColumn: {
      name: "noteId",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "tagId",
      referencedColumnName: "id"
    }
  })
], Note.prototype, "tags", 2);
Note = __decorateClass$2([
  typeorm.Entity()
], Note);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
let DatabaseServiceImpl = class {
  constructor() {
    __publicField(this, "appDataSource");
    this.appDataSource = new typeorm.DataSource({
      type: "better-sqlite3",
      database: "dev.sqlite",
      entities: [Note, Tag],
      synchronize: true
    });
  }
  async initialize() {
    await this.appDataSource.initialize();
  }
  get manager() {
    return this.appDataSource.manager;
  }
};
DatabaseServiceImpl = __decorateClass$1([
  inversify.injectable()
], DatabaseServiceImpl);
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp2(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
let NoteServiceImpl = class {
  constructor(dataService) {
    __publicField(this, "noteRepo");
    __publicField(this, "tagRepo");
    this.dataService = dataService;
    dataService.initialize();
    this.noteRepo = dataService.manager.getRepository(Note);
    this.tagRepo = dataService.manager.getRepository(Tag);
  }
  async findAll() {
    const notes = await this.noteRepo.find();
    console.log("notes", notes);
    return notes;
  }
  async create() {
    const note = new Note();
    note.title = "";
    note.content = "";
    note.tags = [];
    const created = await this.noteRepo.save(note);
    return created;
  }
  deleteUnusedTags() {
    const query = this.tagRepo.createQueryBuilder("tag").leftJoinAndSelect("tag.notes", "note").where("note.id IS NULL");
    query.getMany().then((tags) => {
      this.tagRepo.remove(tags);
    });
  }
  async update(id, updates) {
    const { title, content, tags } = updates;
    const tagNames = (tags == null ? void 0 : tags.map((tag) => tag.name)) || [];
    const existingTags = await this.tagRepo.find({
      where: {
        name: typeorm.In(tagNames)
      }
    });
    const newTags = tagNames.filter(
      (name) => !existingTags.find((tag) => tag.name === name)
    ).map((name) => this.tagRepo.create({ name }));
    await this.tagRepo.save(newTags);
    const allTags = [...existingTags, ...newTags];
    const note = this.noteRepo.save({
      id,
      title,
      content,
      tags: allTags
    });
    this.deleteUnusedTags();
    return note;
  }
  async searchTags(query) {
    const tags = await this.tagRepo.find({
      where: {
        name: typeorm.Like(`%${query}%`)
      }
    });
    return tags;
  }
  async searchNotes(query) {
    const notes = await this.noteRepo.find({
      where: [
        {
          title: typeorm.Like(`%${query}%`)
        },
        {
          content: typeorm.Like(`%${query}%`)
        }
      ]
    });
    return notes;
  }
};
NoteServiceImpl = __decorateClass([
  inversify.injectable(),
  __decorateParam(0, inversify.inject(INJECTIONS.DatabaseService))
], NoteServiceImpl);
const container = new inversify.Container({
  skipBaseClassChecks: true,
  defaultScope: "Singleton",
  autoBindInjectable: true
});
container.bind(INJECTIONS.DatabaseService).to(DatabaseServiceImpl);
container.bind(INJECTIONS.NoteService).to(NoteServiceImpl);
const noteServ = container.get(INJECTIONS.NoteService);
const API = {
  allNotes: async () => noteServ.findAll(),
  createNote: async () => noteServ.create(),
  updateNote: async (id, updates) => noteServ.update(id, updates),
  searchNotes: async (query) => noteServ.searchNotes(query),
  searchTags: async (query) => noteServ.searchTags(query)
};
const api = { API };
electron.contextBridge.exposeInMainWorld("api", api);
function domReady(condition = ["complete", "interactive"]) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}
const safeDOM = {
  append(parent, child) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent, child) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  }
};
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");
  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;
  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    }
  };
}
const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);
window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};
setTimeout(removeLoading, 4999);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL2VsZWN0cm9uL3ByZWxvYWQvYXBpL2luamVjdGlvbnMudHMiLCIuLi8uLi9lbGVjdHJvbi9wcmVsb2FkL2FwaS90eXBlb3JtL2VudGl0eS9UYWcudHMiLCIuLi8uLi9lbGVjdHJvbi9wcmVsb2FkL2FwaS90eXBlb3JtL2VudGl0eS9Ob3RlLnRzIiwiLi4vLi4vZWxlY3Ryb24vcHJlbG9hZC9hcGkvc2VydmljZS9EYXRhYmFzZVNlcnZpY2UudHMiLCIuLi8uLi9lbGVjdHJvbi9wcmVsb2FkL2FwaS9zZXJ2aWNlL05vdGVTZXJ2aWNlLnRzIiwiLi4vLi4vZWxlY3Ryb24vcHJlbG9hZC9hcGkvaW52ZXJzaWZ5LmNvbmZpZy50cyIsIi4uLy4uL2VsZWN0cm9uL3ByZWxvYWQvYXBpL2luZGV4LnRzIiwiLi4vLi4vZWxlY3Ryb24vcHJlbG9hZC9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgSU5KRUNUSU9OUyA9IHtcbiAgRGF0YWJhc2VTZXJ2aWNlOiBTeW1ib2wuZm9yKFwiRGF0YWJhc2VTZXJ2aWNlXCIpLFxuICBOb3RlU2VydmljZTogU3ltYm9sLmZvcihcIk5vdGVTZXJ2aWNlXCIpLFxufTtcbiIsImltcG9ydCB7XG4gIEVudGl0eSxcbiAgQ29sdW1uLFxuICBQcmltYXJ5R2VuZXJhdGVkQ29sdW1uLFxuICBDcmVhdGVEYXRlQ29sdW1uLFxuICBNYW55VG9NYW55LFxuICBVbmlxdWUsXG59IGZyb20gXCJ0eXBlb3JtXCI7XG5cbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0IHsgTm90ZSB9IGZyb20gXCIuL05vdGVcIjtcblxuQEVudGl0eSgpXG5leHBvcnQgY2xhc3MgVGFnIHtcbiAgQFByaW1hcnlHZW5lcmF0ZWRDb2x1bW4oXCJ1dWlkXCIpXG4gIGlkITogc3RyaW5nO1xuXG4gIEBDb2x1bW4oXCJ2YXJjaGFyXCIpXG4gIEBVbmlxdWUoXCJ0YWdfbmFtZV91bmlxdWVcIiwgW1wibmFtZVwiXSlcbiAgbmFtZSE6IHN0cmluZztcblxuICBATWFueVRvTWFueSgoKSA9PiBOb3RlLCAobm90ZSkgPT4gbm90ZS50YWdzKVxuICBub3RlcyE6IE5vdGVbXTtcblxuICBAQ3JlYXRlRGF0ZUNvbHVtbih7XG4gICAgdHJhbnNmb3JtZXI6IHtcbiAgICAgIGZyb206IChkYXRlOiBEYXRlKSA9PiBtb21lbnQoZGF0ZSkudmFsdWVPZigpLFxuICAgICAgdG86ICgpID0+IG5ldyBEYXRlKCksXG4gICAgfSxcbiAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gIH0pXG4gIGNyZWF0ZWRBdCE6IG51bWJlcjtcbn1cbiIsImltcG9ydCB7XG4gIEVudGl0eSxcbiAgQ29sdW1uLFxuICBQcmltYXJ5R2VuZXJhdGVkQ29sdW1uLFxuICBDcmVhdGVEYXRlQ29sdW1uLFxuICBVcGRhdGVEYXRlQ29sdW1uLFxuICBEZWxldGVEYXRlQ29sdW1uLFxuICBNYW55VG9NYW55LFxuICBKb2luVGFibGUsXG59IGZyb20gXCJ0eXBlb3JtXCI7XG5cbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0IHsgVGFnIH0gZnJvbSBcIi4vVGFnXCI7XG5cbkBFbnRpdHkoKVxuZXhwb3J0IGNsYXNzIE5vdGUge1xuICBAUHJpbWFyeUdlbmVyYXRlZENvbHVtbihcInV1aWRcIilcbiAgaWQhOiBzdHJpbmc7XG5cbiAgQENvbHVtbihcInZhcmNoYXJcIilcbiAgdGl0bGUhOiBzdHJpbmc7XG5cbiAgQENvbHVtbihcInZhcmNoYXJcIilcbiAgY29udGVudCE6IHN0cmluZztcblxuICBAQ3JlYXRlRGF0ZUNvbHVtbih7XG4gICAgdHJhbnNmb3JtZXI6IHtcbiAgICAgIGZyb206IChkYXRlOiBEYXRlKSA9PiBtb21lbnQoZGF0ZSkudmFsdWVPZigpLFxuICAgICAgdG86ICgpID0+IG5ldyBEYXRlKCksXG4gICAgfSxcbiAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gIH0pXG4gIGNyZWF0ZWRBdCE6IG51bWJlcjtcblxuICBAVXBkYXRlRGF0ZUNvbHVtbih7XG4gICAgdHJhbnNmb3JtZXI6IHtcbiAgICAgIGZyb206IChkYXRlOiBEYXRlKSA9PiBtb21lbnQoZGF0ZSkudmFsdWVPZigpLFxuICAgICAgdG86ICgpID0+IG5ldyBEYXRlKCksXG4gICAgfSxcbiAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gIH0pXG4gIHVwZGF0ZWRBdCE6IG51bWJlcjtcblxuICBARGVsZXRlRGF0ZUNvbHVtbih7XG4gICAgdHJhbnNmb3JtZXI6IHtcbiAgICAgIGZyb206IChkYXRlOiBEYXRlIHwgbnVsbCkgPT5cbiAgICAgICAgZGF0ZSA/IG1vbWVudChkYXRlKS52YWx1ZU9mKCkgOiBudWxsLFxuICAgICAgdG86IChtaWxsaXM6IG51bWJlciB8IG51bGwpID0+XG4gICAgICAgIG1pbGxpcyA/IG1vbWVudChtaWxsaXMpLnRvRGF0ZSgpIDogbnVsbCxcbiAgICB9LFxuICAgIHR5cGU6IFwiZGF0ZXRpbWVcIixcbiAgfSlcbiAgZGVsZXRlZEF0ITogbnVtYmVyIHwgbnVsbDtcblxuICBATWFueVRvTWFueSgoKSA9PiBUYWcsICh0YWcpID0+IHRhZy5ub3Rlcywge1xuICAgIGNhc2NhZGU6IHRydWUsXG4gICAgZWFnZXI6IHRydWUsXG4gIH0pXG4gIEBKb2luVGFibGUoe1xuICAgIG5hbWU6IFwibm90ZV90YWdcIixcbiAgICBqb2luQ29sdW1uOiB7XG4gICAgICBuYW1lOiBcIm5vdGVJZFwiLFxuICAgICAgcmVmZXJlbmNlZENvbHVtbk5hbWU6IFwiaWRcIixcbiAgICB9LFxuICAgIGludmVyc2VKb2luQ29sdW1uOiB7XG4gICAgICBuYW1lOiBcInRhZ0lkXCIsXG4gICAgICByZWZlcmVuY2VkQ29sdW1uTmFtZTogXCJpZFwiLFxuICAgIH0sXG4gIH0pXG4gIHRhZ3MhOiBUYWdbXTtcbn1cbiIsImltcG9ydCB7IERhdGFTb3VyY2UsIEVudGl0eU1hbmFnZXIgfSBmcm9tIFwidHlwZW9ybVwiO1xuaW1wb3J0IHsgTm90ZSB9IGZyb20gXCIuLi90eXBlb3JtL2VudGl0eS9Ob3RlXCI7XG5pbXBvcnQgeyBpbmplY3RhYmxlIH0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IHsgVGFnIH0gZnJvbSBcIi4uL3R5cGVvcm0vZW50aXR5L1RhZ1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIERhdGFiYXNlU2VydmljZSB7XG4gIGluaXRpYWxpemUoKTogUHJvbWlzZTx2b2lkPjtcbiAgbWFuYWdlcjogRW50aXR5TWFuYWdlcjtcbn1cblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGF0YWJhc2VTZXJ2aWNlSW1wbCBpbXBsZW1lbnRzIERhdGFiYXNlU2VydmljZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXBwRGF0YVNvdXJjZTogRGF0YVNvdXJjZTtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hcHBEYXRhU291cmNlID0gbmV3IERhdGFTb3VyY2Uoe1xuICAgICAgdHlwZTogXCJiZXR0ZXItc3FsaXRlM1wiLFxuICAgICAgZGF0YWJhc2U6IFwiZGV2LnNxbGl0ZVwiLFxuICAgICAgZW50aXRpZXM6IFtOb3RlLCBUYWddLFxuICAgICAgc3luY2hyb25pemU6IHRydWUsXG4gICAgfSk7XG4gIH1cbiAgYXN5bmMgaW5pdGlhbGl6ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmFwcERhdGFTb3VyY2UuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgZ2V0IG1hbmFnZXIoKTogRW50aXR5TWFuYWdlciB7XG4gICAgcmV0dXJuIHRoaXMuYXBwRGF0YVNvdXJjZS5tYW5hZ2VyO1xuICB9XG59XG4iLCJpbXBvcnQgeyBpbmplY3QsIGluamVjdGFibGUgfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQgeyBJTkpFQ1RJT05TIH0gZnJvbSBcIi4uL2luamVjdGlvbnNcIjtcbmltcG9ydCB7IE5vdGUgfSBmcm9tIFwiLi4vdHlwZW9ybS9lbnRpdHkvTm90ZVwiO1xuaW1wb3J0IERhdGFiYXNlU2VydmljZSBmcm9tIFwiLi9EYXRhYmFzZVNlcnZpY2VcIjtcbmltcG9ydCB7IERlZXBQYXJ0aWFsLCBJbiwgUmVwb3NpdG9yeSwgTGlrZSB9IGZyb20gXCJ0eXBlb3JtXCI7XG5pbXBvcnQgeyBUYWcgfSBmcm9tIFwiLi4vdHlwZW9ybS9lbnRpdHkvVGFnXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm90ZVNlcnZpY2Uge1xuICBmaW5kQWxsKCk6IFByb21pc2U8Tm90ZVtdPjtcbiAgY3JlYXRlKCk6IFByb21pc2U8Tm90ZT47XG4gIHVwZGF0ZShpZDogc3RyaW5nLCB1cGRhdGVzOiBEZWVwUGFydGlhbDxOb3RlPik6IFByb21pc2U8Tm90ZT47XG4gIHNlYXJjaFRhZ3MocXVlcnk6IHN0cmluZyk6IFByb21pc2U8VGFnW10+O1xuICBzZWFyY2hOb3RlcyhxdWVyeTogc3RyaW5nKTogUHJvbWlzZTxOb3RlW10+O1xufVxuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RlU2VydmljZUltcGwgaW1wbGVtZW50cyBOb3RlU2VydmljZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbm90ZVJlcG86IFJlcG9zaXRvcnk8Tm90ZT47XG4gIHByaXZhdGUgcmVhZG9ubHkgdGFnUmVwbzogUmVwb3NpdG9yeTxUYWc+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBpbmplY3QoSU5KRUNUSU9OUy5EYXRhYmFzZVNlcnZpY2UpXG4gICAgcHJpdmF0ZSByZWFkb25seSBkYXRhU2VydmljZTogRGF0YWJhc2VTZXJ2aWNlXG4gICkge1xuICAgIGRhdGFTZXJ2aWNlLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm5vdGVSZXBvID0gZGF0YVNlcnZpY2UubWFuYWdlci5nZXRSZXBvc2l0b3J5KE5vdGUpO1xuICAgIHRoaXMudGFnUmVwbyA9IGRhdGFTZXJ2aWNlLm1hbmFnZXIuZ2V0UmVwb3NpdG9yeShUYWcpO1xuICB9XG5cbiAgYXN5bmMgZmluZEFsbCgpOiBQcm9taXNlPE5vdGVbXT4ge1xuICAgIGNvbnN0IG5vdGVzID0gYXdhaXQgdGhpcy5ub3RlUmVwby5maW5kKCk7XG4gICAgY29uc29sZS5sb2coXCJub3Rlc1wiLCBub3Rlcyk7XG4gICAgcmV0dXJuIG5vdGVzO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlKCk6IFByb21pc2U8Tm90ZT4ge1xuICAgIGNvbnN0IG5vdGUgPSBuZXcgTm90ZSgpO1xuICAgIG5vdGUudGl0bGUgPSBcIlwiO1xuICAgIG5vdGUuY29udGVudCA9IFwiXCI7XG4gICAgbm90ZS50YWdzID0gW107XG4gICAgY29uc3QgY3JlYXRlZCA9IGF3YWl0IHRoaXMubm90ZVJlcG8uc2F2ZShub3RlKTtcbiAgICByZXR1cm4gY3JlYXRlZDtcbiAgfVxuXG4gIGRlbGV0ZVVudXNlZFRhZ3MoKSB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLnRhZ1JlcG9cbiAgICAgIC5jcmVhdGVRdWVyeUJ1aWxkZXIoXCJ0YWdcIilcbiAgICAgIC5sZWZ0Sm9pbkFuZFNlbGVjdChcInRhZy5ub3Rlc1wiLCBcIm5vdGVcIilcbiAgICAgIC53aGVyZShcIm5vdGUuaWQgSVMgTlVMTFwiKTtcblxuICAgIHF1ZXJ5LmdldE1hbnkoKS50aGVuKCh0YWdzKSA9PiB7XG4gICAgICB0aGlzLnRhZ1JlcG8ucmVtb3ZlKHRhZ3MpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgdXBkYXRlczogRGVlcFBhcnRpYWw8Tm90ZT5cbiAgKTogUHJvbWlzZTxOb3RlPiB7XG4gICAgY29uc3QgeyB0aXRsZSwgY29udGVudCwgdGFncyB9ID0gdXBkYXRlcztcbiAgICBjb25zdCB0YWdOYW1lcyA9IHRhZ3M/Lm1hcCgodGFnKSA9PiB0YWcubmFtZSkgfHwgW107XG4gICAgY29uc3QgZXhpc3RpbmdUYWdzID0gYXdhaXQgdGhpcy50YWdSZXBvLmZpbmQoe1xuICAgICAgd2hlcmU6IHtcbiAgICAgICAgbmFtZTogSW4odGFnTmFtZXMpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG5ld1RhZ3MgPSB0YWdOYW1lc1xuICAgICAgLmZpbHRlcihcbiAgICAgICAgKG5hbWUpID0+ICFleGlzdGluZ1RhZ3MuZmluZCgodGFnKSA9PiB0YWcubmFtZSA9PT0gbmFtZSlcbiAgICAgIClcbiAgICAgIC5tYXAoKG5hbWUpID0+IHRoaXMudGFnUmVwby5jcmVhdGUoeyBuYW1lIH0pKTtcblxuICAgIGF3YWl0IHRoaXMudGFnUmVwby5zYXZlKG5ld1RhZ3MpO1xuICAgIGNvbnN0IGFsbFRhZ3MgPSBbLi4uZXhpc3RpbmdUYWdzLCAuLi5uZXdUYWdzXTtcblxuICAgIGNvbnN0IG5vdGUgPSB0aGlzLm5vdGVSZXBvLnNhdmUoe1xuICAgICAgaWQsXG4gICAgICB0aXRsZSxcbiAgICAgIGNvbnRlbnQsXG4gICAgICB0YWdzOiBhbGxUYWdzLFxuICAgIH0pO1xuXG4gICAgdGhpcy5kZWxldGVVbnVzZWRUYWdzKCk7XG4gICAgcmV0dXJuIG5vdGU7XG4gIH1cblxuICBhc3luYyBzZWFyY2hUYWdzKHF1ZXJ5OiBzdHJpbmcpOiBQcm9taXNlPFRhZ1tdPiB7XG4gICAgY29uc3QgdGFncyA9IGF3YWl0IHRoaXMudGFnUmVwby5maW5kKHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIG5hbWU6IExpa2UoYCUke3F1ZXJ5fSVgKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHRhZ3M7XG4gIH1cblxuICBhc3luYyBzZWFyY2hOb3RlcyhxdWVyeTogc3RyaW5nKTogUHJvbWlzZTxOb3RlW10+IHtcbiAgICBjb25zdCBub3RlcyA9IGF3YWl0IHRoaXMubm90ZVJlcG8uZmluZCh7XG4gICAgICB3aGVyZTogW1xuICAgICAgICB7XG4gICAgICAgICAgdGl0bGU6IExpa2UoYCUke3F1ZXJ5fSVgKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbnRlbnQ6IExpa2UoYCUke3F1ZXJ5fSVgKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgcmV0dXJuIG5vdGVzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQgeyBJTkpFQ1RJT05TIH0gZnJvbSBcIi4vaW5qZWN0aW9uc1wiO1xuaW1wb3J0IERhdGFiYXNlU2VydmljZSBmcm9tIFwiLi9zZXJ2aWNlL0RhdGFiYXNlU2VydmljZVwiO1xuaW1wb3J0IERhdGFiYXNlU2VydmljZUltcGwgZnJvbSBcIi4vc2VydmljZS9EYXRhYmFzZVNlcnZpY2VcIjtcbmltcG9ydCBOb3RlU2VydmljZUltcGwsIHsgTm90ZVNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlL05vdGVTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjb25zdCBjb250YWluZXIgPSBuZXcgQ29udGFpbmVyKHtcbiAgc2tpcEJhc2VDbGFzc0NoZWNrczogdHJ1ZSxcbiAgZGVmYXVsdFNjb3BlOiBcIlNpbmdsZXRvblwiLFxuICBhdXRvQmluZEluamVjdGFibGU6IHRydWUsXG59KTtcbmNvbnRhaW5lclxuICAuYmluZDxEYXRhYmFzZVNlcnZpY2U+KElOSkVDVElPTlMuRGF0YWJhc2VTZXJ2aWNlKVxuICAudG8oRGF0YWJhc2VTZXJ2aWNlSW1wbCk7XG5cbmNvbnRhaW5lclxuICAuYmluZDxOb3RlU2VydmljZT4oSU5KRUNUSU9OUy5Ob3RlU2VydmljZSlcbiAgLnRvKE5vdGVTZXJ2aWNlSW1wbCk7XG4iLCJpbXBvcnQgeyBEZWVwUGFydGlhbCB9IGZyb20gXCJ0eXBlb3JtXCI7XG5pbXBvcnQgeyBJTkpFQ1RJT05TIH0gZnJvbSBcIi4vaW5qZWN0aW9uc1wiO1xuaW1wb3J0IHsgY29udGFpbmVyIH0gZnJvbSBcIi4vaW52ZXJzaWZ5LmNvbmZpZ1wiO1xuaW1wb3J0IHsgTm90ZVNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlL05vdGVTZXJ2aWNlXCI7XG5pbXBvcnQgeyBOb3RlIH0gZnJvbSBcIi4vdHlwZW9ybS9lbnRpdHkvTm90ZVwiO1xuXG4vLyBjb25zdCBEYXRhYmFzZVNlcnZpY2UgPSBjb250YWluZXIuZ2V0PERhdGFiYXNlU2VydmljZT4oXG4vLyAgIElOSkVDVElPTlMuRGF0YWJhc2VTZXJ2aWNlXG4vLyApO1xuXG4vLyBjb25zb2xlLmxvZyhcIkRhdGFiYXNlU2VydmljZVwiLCBEYXRhYmFzZVNlcnZpY2UpO1xuLy8gRGF0YWJhc2VTZXJ2aWNlLmluaXRpYWxpemUoKTtcblxuY29uc3Qgbm90ZVNlcnYgPSBjb250YWluZXIuZ2V0PE5vdGVTZXJ2aWNlPihJTkpFQ1RJT05TLk5vdGVTZXJ2aWNlKTtcblxuY29uc3QgQVBJID0ge1xuICBhbGxOb3RlczogYXN5bmMgKCkgPT4gbm90ZVNlcnYuZmluZEFsbCgpLFxuICBjcmVhdGVOb3RlOiBhc3luYyAoKSA9PiBub3RlU2Vydi5jcmVhdGUoKSxcbiAgdXBkYXRlTm90ZTogYXN5bmMgKGlkOiBzdHJpbmcsIHVwZGF0ZXM6IERlZXBQYXJ0aWFsPE5vdGU+KSA9PlxuICAgIG5vdGVTZXJ2LnVwZGF0ZShpZCwgdXBkYXRlcyksXG4gIHNlYXJjaE5vdGVzOiBhc3luYyAocXVlcnk6IHN0cmluZykgPT4gbm90ZVNlcnYuc2VhcmNoTm90ZXMocXVlcnkpLFxuICBzZWFyY2hUYWdzOiBhc3luYyAocXVlcnk6IHN0cmluZykgPT4gbm90ZVNlcnYuc2VhcmNoVGFncyhxdWVyeSksXG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IEFQSSB9O1xuIiwiaW1wb3J0IHsgY29udGV4dEJyaWRnZSB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IGFwaSBmcm9tIFwiLi9hcGlcIjtcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZChcImFwaVwiLCBhcGkpO1xuXG5mdW5jdGlvbiBkb21SZWFkeShcbiAgY29uZGl0aW9uOiBEb2N1bWVudFJlYWR5U3RhdGVbXSA9IFtcImNvbXBsZXRlXCIsIFwiaW50ZXJhY3RpdmVcIl1cbikge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAoY29uZGl0aW9uLmluY2x1ZGVzKGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XG4gICAgICByZXNvbHZlKHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicmVhZHlzdGF0ZWNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChjb25kaXRpb24uaW5jbHVkZXMoZG9jdW1lbnQucmVhZHlTdGF0ZSkpIHtcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5jb25zdCBzYWZlRE9NID0ge1xuICBhcHBlbmQocGFyZW50OiBIVE1MRWxlbWVudCwgY2hpbGQ6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKCFBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuZmluZCgoZSkgPT4gZSA9PT0gY2hpbGQpKSB7XG4gICAgICByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9XG4gIH0sXG4gIHJlbW92ZShwYXJlbnQ6IEhUTUxFbGVtZW50LCBjaGlsZDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAoQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbmQoKGUpID0+IGUgPT09IGNoaWxkKSkge1xuICAgICAgcmV0dXJuIHBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgfVxuICB9LFxufTtcblxuLyoqXG4gKiBodHRwczovL3RvYmlhc2FobGluLmNvbS9zcGlua2l0XG4gKiBodHRwczovL2Nvbm5vcmF0aGVydG9uLmNvbS9sb2FkZXJzXG4gKiBodHRwczovL3Byb2plY3RzLmx1a2VoYWFzLm1lL2Nzcy1sb2FkZXJzXG4gKiBodHRwczovL21hdGVqa3VzdGVjLmdpdGh1Yi5pby9TcGluVGhhdFNoaXRcbiAqL1xuZnVuY3Rpb24gdXNlTG9hZGluZygpIHtcbiAgY29uc3QgY2xhc3NOYW1lID0gYGxvYWRlcnMtY3NzX19zcXVhcmUtc3BpbmA7XG4gIGNvbnN0IHN0eWxlQ29udGVudCA9IGBcbkBrZXlmcmFtZXMgc3F1YXJlLXNwaW4ge1xuICAyNSUgeyB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDE4MGRlZykgcm90YXRlWSgwKTsgfVxuICA1MCUgeyB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDE4MGRlZykgcm90YXRlWSgxODBkZWcpOyB9XG4gIDc1JSB7IHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMCkgcm90YXRlWSgxODBkZWcpOyB9XG4gIDEwMCUgeyB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDApIHJvdGF0ZVkoMCk7IH1cbn1cbi4ke2NsYXNzTmFtZX0gPiBkaXYge1xuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xuICB3aWR0aDogNTBweDtcbiAgaGVpZ2h0OiA1MHB4O1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBhbmltYXRpb246IHNxdWFyZS1zcGluIDNzIDBzIGN1YmljLWJlemllcigwLjA5LCAwLjU3LCAwLjQ5LCAwLjkpIGluZmluaXRlO1xufVxuLmFwcC1sb2FkaW5nLXdyYXAge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBoZWlnaHQ6IDEwMHZoO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYmFja2dyb3VuZDogIzI4MmMzNDtcbiAgei1pbmRleDogOTtcbn1cbiAgICBgO1xuICBjb25zdCBvU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIGNvbnN0IG9EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gIG9TdHlsZS5pZCA9IFwiYXBwLWxvYWRpbmctc3R5bGVcIjtcbiAgb1N0eWxlLmlubmVySFRNTCA9IHN0eWxlQ29udGVudDtcbiAgb0Rpdi5jbGFzc05hbWUgPSBcImFwcC1sb2FkaW5nLXdyYXBcIjtcbiAgb0Rpdi5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiPjxkaXY+PC9kaXY+PC9kaXY+YDtcblxuICByZXR1cm4ge1xuICAgIGFwcGVuZExvYWRpbmcoKSB7XG4gICAgICBzYWZlRE9NLmFwcGVuZChkb2N1bWVudC5oZWFkLCBvU3R5bGUpO1xuICAgICAgc2FmZURPTS5hcHBlbmQoZG9jdW1lbnQuYm9keSwgb0Rpdik7XG4gICAgfSxcbiAgICByZW1vdmVMb2FkaW5nKCkge1xuICAgICAgc2FmZURPTS5yZW1vdmUoZG9jdW1lbnQuaGVhZCwgb1N0eWxlKTtcbiAgICAgIHNhZmVET00ucmVtb3ZlKGRvY3VtZW50LmJvZHksIG9EaXYpO1xuICAgIH0sXG4gIH07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY29uc3QgeyBhcHBlbmRMb2FkaW5nLCByZW1vdmVMb2FkaW5nIH0gPSB1c2VMb2FkaW5nKCk7XG5kb21SZWFkeSgpLnRoZW4oYXBwZW5kTG9hZGluZyk7XG5cbndpbmRvdy5vbm1lc3NhZ2UgPSAoZXYpID0+IHtcbiAgZXYuZGF0YS5wYXlsb2FkID09PSBcInJlbW92ZUxvYWRpbmdcIiAmJiByZW1vdmVMb2FkaW5nKCk7XG59O1xuXG5zZXRUaW1lb3V0KHJlbW92ZUxvYWRpbmcsIDQ5OTkpO1xuIl0sIm5hbWVzIjpbIl9fZGVjb3JhdGVDbGFzcyIsIlByaW1hcnlHZW5lcmF0ZWRDb2x1bW4iLCJDb2x1bW4iLCJVbmlxdWUiLCJNYW55VG9NYW55IiwiQ3JlYXRlRGF0ZUNvbHVtbiIsIkVudGl0eSIsIlVwZGF0ZURhdGVDb2x1bW4iLCJEZWxldGVEYXRlQ29sdW1uIiwiSm9pblRhYmxlIiwiRGF0YVNvdXJjZSIsImluamVjdGFibGUiLCJJbiIsIkxpa2UiLCJpbmplY3QiLCJDb250YWluZXIiLCJjb250ZXh0QnJpZGdlIl0s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
