# 读取提交信息文件
COMMIT_MSG_FILE="$1"
COMMIT_MSG=$(head -n 1 "$COMMIT_MSG_FILE")

# Conventional Commits 格式正则表达式
CONVENTIONAL_COMMIT_PATTERN="^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test|wip)(\([a-z0-9\-]+\))?!?: .+$"

# 检查是否匹配 Conventional Commits 格式
if ! echo "$COMMIT_MSG" | grep -Eiq "$CONVENTIONAL_COMMIT_PATTERN"; then
  echo "❌ 提交信息不符合 Conventional Commits 规范！"
  echo ""
  echo "提交信息应遵循以下格式:"
  echo "  <type>: <description>"
  echo "  <type>(<scope>): <description>"
  echo ""
  echo "支持的类型: build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test"
  echo ""
  echo "当前提交信息: $COMMIT_MSG"
  exit 1
fi

echo "✅ 提交信息符合 Conventional Commits 规范"