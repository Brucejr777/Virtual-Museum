from __future__ import annotations

import argparse
from pathlib import Path

GENERATED_DIRECTORIES = {
    ".venv",
    "__pycache__",
    "dist",
    "node_modules",
    "venv",
}
ALWAYS_EXCLUDED_DIRECTORIES = GENERATED_DIRECTORIES | {".git"}


def is_binary(path: Path) -> bool:
    with path.open("rb") as file:
        sample = file.read(8192)

    if b"\0" in sample:
        return True

    text = sample.decode("utf-8", errors="ignore")
    control_characters = sum(
        ord(character) < 32 and character not in "\n\r\t\f\b"
        for character in text
    )
    return len(text) > 0 and control_characters / len(text) > 0.30


def collect_files(root: Path, output: Path, include_generated: bool) -> list[Path]:
    excluded_directories = (
        {".git"} if include_generated else ALWAYS_EXCLUDED_DIRECTORIES
    )
    files: list[Path] = []

    for path in root.rglob("*"):
        if not path.is_file():
            continue

        relative_path = path.relative_to(root)
        if path.resolve() == output.resolve():
            continue
        if excluded_directories.intersection(relative_path.parts):
            continue

        files.append(path)

    return sorted(files, key=lambda path: path.relative_to(root).as_posix().lower())


def combine_files(root: Path, output: Path, include_generated: bool) -> tuple[int, int]:
    files = collect_files(root, output, include_generated)
    binary_files = 0

    with output.open("w", encoding="utf-8", newline="\n") as context_file:
        context_file.write("AI PROJECT CONTEXT\n")
        context_file.write(f"Source directory: {root.resolve()}\n")
        context_file.write(f"Files included: {len(files)}\n\n")

        for path in files:
            relative_path = path.relative_to(root).as_posix()
            context_file.write("=" * 80)
            context_file.write("\n")
            context_file.write(f"FILE: {relative_path}\n")
            context_file.write("-" * 80)
            context_file.write("\n")

            if is_binary(path):
                context_file.write("[Binary file omitted]\n\n")
                binary_files += 1
                continue

            content = path.read_text(encoding="utf-8", errors="replace")
            for line_number, line in enumerate(content.splitlines(), start=1):
                context_file.write(f"{line_number:6d} | {line}\n")
            context_file.write("\n")

    return len(files), binary_files


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Combine project files into one line-numbered context file."
    )
    parser.add_argument(
        "directory",
        nargs="?",
        type=Path,
        default=Path.cwd(),
        help="Directory to scan (default: current directory).",
    )
    parser.add_argument(
        "output",
        nargs="?",
        type=Path,
        default=Path("context.txt"),
        help="Output text file (default: context.txt).",
    )
    parser.add_argument(
        "--include-generated",
        action="store_true",
        help="Include node_modules, dist, virtual environments, and caches.",
    )
    return parser.parse_args()


def main() -> None:
    arguments = parse_arguments()
    root = arguments.directory.resolve()
    output = arguments.output.resolve()

    if not root.is_dir():
        raise SystemExit(f"Directory does not exist: {root}")

    output.parent.mkdir(parents=True, exist_ok=True)
    file_count, binary_count = combine_files(
        root,
        output,
        arguments.include_generated,
    )

    print(f"Wrote {output} with {file_count} files.")
    print(f"Omitted {binary_count} binary files.")


if __name__ == "__main__":
    main()
