#!/usr/bin/env bash

set -euo pipefail

usage() {
  echo "用法: pnpm worktree:create <feature|fix|demo|release>/<name> [目标目录]" >&2
}

branch_name="${1:-}"
target_dir="${2:-}"

if [[ ! "$branch_name" =~ ^(feature|fix|demo|release)/[a-zA-Z0-9._-]+$ ]]; then
  usage
  exit 1
fi

repo_root="$(git rev-parse --show-toplevel)"
repo_parent="$(dirname "$repo_root")"
repo_name="$(basename "$repo_root")"
branch_slug="${branch_name//\//-}"
target_dir="${target_dir:-$repo_parent/$repo_name-$branch_slug}"

if git show-ref --verify --quiet "refs/heads/$branch_name"; then
  echo "本地分支已存在: $branch_name" >&2
  exit 1
fi

if [[ -e "$target_dir" ]]; then
  echo "目标目录已存在: $target_dir" >&2
  exit 1
fi

git -C "$repo_root" fetch --prune origin

if git -C "$repo_root" show-ref --verify --quiet "refs/remotes/origin/$branch_name"; then
  echo "远端分支已存在: origin/$branch_name" >&2
  echo "请使用: git worktree add $(printf '%q' "$target_dir") $branch_name" >&2
  exit 1
fi

git -C "$repo_root" worktree add -b "$branch_name" "$target_dir" origin/main

echo "Worktree 已创建:"
echo "  分支: $branch_name"
echo "  目录: $target_dir"
echo
echo "下一步:"
printf '  cd %q\n' "$target_dir"
echo "  pnpm install --frozen-lockfile"
echo "  pnpm dev"
