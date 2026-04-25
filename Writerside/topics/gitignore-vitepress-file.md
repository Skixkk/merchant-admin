# gitignore vitepress files

**是的！必须添加到 `.gitignore`** ✅
`docs/.vitepress/cache` 是 **VitePress 自动生成的构建缓存文件夹**，属于临时文件、环境专属文件，**绝对不需要提交到 Git 仓库
**。

---

## 一、直接给你可用的 `.gitignore` 规则

打开你项目**根目录**的 `.gitignore` 文件（没有就新建一个），添加这两行：

```gitignore
# VitePress 缓存（自动生成，必须忽略）
docs/.vitepress/cache/

# VitePress 构建产物（dist 是打包后的文件，也建议忽略）
docs/.vitepress/dist/
```

---

## 二、为什么必须忽略？

1. **自动生成**：运行 `vitepress dev` / `vitepress build` 时会**自动重建**，删了也不影响项目；
2. **环境无关**：缓存是你本地电脑生成的临时文件，同事/服务器不需要它；
3. **避免冲突**：不同系统、不同构建次数的缓存文件不一样，提交会导致 Git 冲突；
4. **体积冗余**：缓存文件会越来越大，白白占用 Git 仓库空间。

---

## 三、额外建议（完整的 VitePress 忽略规则）

如果你想规范一点，可以直接把这些都加上：

```gitignore
# VitePress
docs/.vitepress/cache/
docs/.vitepress/dist/
docs/.vitepress/.temp/

# 通用前端
node_modules/
.DS_Store
*.log
```

---

### 总结

1. `cache/` → 本地缓存 → **必忽略**
2. `dist/` → 构建产物 → **建议忽略**（服务器单独构建/上传即可）
3. 复制上面的规则到 `.gitignore`，一键搞定！