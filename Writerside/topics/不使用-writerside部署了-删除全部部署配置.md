# 不使用 writerside部署了 删除全部部署配置

# 操作步骤

直接**删除文件**即可：

```
.github/workflows/build-docs.yml
```

这是你全部的 Writerside 部署配置文件，删除后就彻底清理了所有相关部署逻辑。

---

# 符合 Angular 规范的 Git 提交信息

```
ci(workflow): 🗑️ remove all Writerside deployment configurations

Completely delete the build-docs.yml workflow file to disable Writerside documentation deployment.
Remove all build, test, deploy and Algolia indexing pipeline for documentation.
No other project files or configurations are modified.

Refs: #1
```