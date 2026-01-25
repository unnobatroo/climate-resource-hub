#!/usr/bin/env python3
"""
Script to automatically sort resource links in markdown files alphabetically by title.
This maintains the structure of resource cards while sorting them within each section.
"""

import re
import sys
from pathlib import Path


def extract_resource_title(resource_block):
    """Extract the title from a resource card block."""
    match = re.search(r'<h4>.*?>\s*([^<]+)</h4>', resource_block)
    if match:
        return match.group(1).strip()
    return ""


def sort_resources_in_section(section_content):
    """Sort resource cards within a kanban column by title."""
    # Find all resource card blocks (from <a> to </a>)
    resource_pattern = r'<a href="[^"]*" class="resource-card-link">.*?</a>'
    resources = re.findall(resource_pattern, section_content, re.DOTALL)
    
    if not resources:
        return section_content
    
    # Sort resources by title (case-insensitive)
    sorted_resources = sorted(resources, key=lambda x: extract_resource_title(x).lower())
    
    # Replace in order
    result = section_content
    for resource in resources:
        result = result.replace(resource, "", 1)
    
    # Re-insert sorted resources
    for resource in sorted_resources:
        result = result.replace(
            '</div>\n\n<div class="kanban-column" markdown>',
            '</div>\n\n' + resource + '\n\n<div class="kanban-column" markdown>',
            1
        )
    
    # More robust approach: split by resource markers and reconstruct
    parts = re.split(r'(<a href="[^"]*" class="resource-card-link">.*?</a>)', section_content, flags=re.DOTALL)
    
    non_resources = []
    resources_list = []
    
    for i, part in enumerate(parts):
        if part.startswith('<a href='):
            resources_list.append(part)
        else:
            non_resources.append(part)
    
    if not resources_list:
        return section_content
    
    resources_list.sort(key=lambda x: extract_resource_title(x).lower())
    
    # Reconstruct with sorted resources
    result = ""
    resource_idx = 0
    for i, part in enumerate(non_resources):
        result += part
        if resource_idx < len(resources_list) and i < len(parts) - 1:
            result += "\n" + resources_list[resource_idx] + "\n"
            resource_idx += 1
    
    return result


def sort_markdown_file(filepath):
    """Sort all resource cards in a markdown file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False
    
    original_content = content
    
    # Process each kanban-column section
    def sort_column(match):
        column_content = match.group(0)
        # Extract resources and sort them
        resource_pattern = r'<a href="[^"]*" class="resource-card-link">.*?</a>'
        resources = re.findall(resource_pattern, column_content, re.DOTALL)
        
        if not resources:
            return column_content
        
        # Sort by title
        sorted_resources = sorted(resources, key=lambda x: extract_resource_title(x).lower())
        
        # Replace resources in the column
        result = column_content
        for resource in resources:
            result = result.replace(resource, "", 1)
        
        # Add sorted resources back
        insert_pos = result.rfind('</div>')
        if insert_pos != -1:
            sorted_section = "\n".join(sorted_resources)
            result = result[:insert_pos] + sorted_section + "\n\n" + result[insert_pos:]
        
        return result
    
    # More direct approach: sort resources within each column independently
    kanban_column_pattern = r'<div class="kanban-column" markdown>.*?(?=<div class="kanban-column"|$)'
    
    def sort_column_match(match):
        column = match.group(0)
        resource_pattern = r'<a href="[^"]*" class="resource-card-link">.*?</a>'
        resources = re.findall(resource_pattern, column, re.DOTALL)
        
        if not resources:
            return column
        
        sorted_resources = sorted(resources, key=lambda x: extract_resource_title(x).lower())
        
        # Create the sorted version
        lines = column.split('\n')
        result_lines = []
        skip_until_closing = False
        
        for line in lines:
            if '<a href=' in line:
                skip_until_closing = True
            
            if not skip_until_closing:
                result_lines.append(line)
            
            if '</a>' in line:
                skip_until_closing = False
        
        # Reconstruct: header + sorted resources + footer
        header_end = ''.join(result_lines)
        sorted_section = "\n".join(sorted_resources)
        
        # Find insertion point (after header, before closing)
        insert_match = re.search(r'(### [^\n]+\n)', header_end)
        if insert_match:
            header = header_end[:insert_match.end()]
            footer = header_end[insert_match.end():]
            return header + "\n" + sorted_section + "\n" + footer
        
        return header_end + "\n" + sorted_section
    
    # Apply sorting to each kanban column
    content = re.sub(
        r'<div class="kanban-column" markdown>.*?(?=<div class="kanban-column" markdown>|$)',
        sort_column_match,
        content,
        flags=re.DOTALL
    )
    
    # Write back if changed
    if content != original_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Sorted: {filepath}")
            return True
        except Exception as e:
            print(f"Error writing {filepath}: {e}")
            return False
    
    return False


def main():
    """Main entry point."""
    docs_dir = Path(__file__).parent / "docs"
    
    files_to_sort = [
        docs_dir / "education.md",
        docs_dir / "research.md",
        docs_dir / "data.md",
        docs_dir / "careers.md",
        docs_dir / "invest.md",
    ]
    
    changed = False
    for filepath in files_to_sort:
        if filepath.exists():
            if sort_markdown_file(filepath):
                changed = True
        else:
            print(f"File not found: {filepath}")
    
    return 0 if not changed else 0  # Always return 0 for pre-commit


if __name__ == "__main__":
    sys.exit(main())
