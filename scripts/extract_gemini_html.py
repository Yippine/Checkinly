#!/usr/bin/env python3
"""
Gemini HTML to Markdown Converter
從 Gemini 對話的 HTML 匯出檔案提取內容並轉換為 Markdown 格式
"""

from bs4 import BeautifulSoup
import re
from pathlib import Path


def clean_text(text):
    """清理文本中的多餘空白"""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def extract_clean_element_text(element):
    """提取乾淨的文本，移除所有 Angular 元件"""
    # 創建元素副本
    elem_copy = BeautifulSoup(str(element), 'html.parser').find(element.name)

    # 移除所有 Angular 相關元素
    for tag in elem_copy.find_all(['source-footnote', 'sources-carousel', 'sources-carousel-inline',
                                     'response-element', 'mat-icon', 'button', 'sup']):
        tag.decompose()

    # 獲取文本並清理
    text = elem_copy.get_text()
    return clean_text(text)


def convert_table_to_markdown(table_elem):
    """將 HTML 表格轉換為 Markdown 表格"""
    lines = []

    # 處理表頭
    thead = table_elem.find('thead')
    if thead:
        headers = []
        for th in thead.find_all('td'):
            text = extract_clean_element_text(th)
            headers.append(text if text else ' ')

        lines.append('| ' + ' | '.join(headers) + ' |')
        lines.append('|' + '|'.join(['---' for _ in headers]) + '|')

    # 處理表身
    tbody = table_elem.find('tbody')
    if tbody:
        for tr in tbody.find_all('tr'):
            cells = []
            for td in tr.find_all('td'):
                text = extract_clean_element_text(td)
                # 移除表格單元格內的換行
                text = text.replace('\n', ' ')
                cells.append(text if text else ' ')

            if cells:
                lines.append('| ' + ' | '.join(cells) + ' |')

    return '\n'.join(lines)


def convert_list_to_markdown(ul_elem, level=0):
    """將 HTML 列表轉換為 Markdown 列表"""
    lines = []
    indent = '  ' * level

    for li in ul_elem.find_all('li', recursive=False):
        # 提取列表項的文本（不包括嵌套列表）
        li_copy = BeautifulSoup(str(li), 'html.parser').find('li')

        # 移除嵌套的 ul/ol
        for nested in li_copy.find_all(['ul', 'ol']):
            nested.decompose()

        text = extract_clean_element_text(li_copy)

        if text:
            lines.append(f"{indent}- {text}")

        # 處理嵌套列表
        nested_ul = li.find('ul', recursive=False)
        if nested_ul:
            nested_lines = convert_list_to_markdown(nested_ul, level + 1)
            lines.append(nested_lines)

    return '\n'.join(lines)


def html_to_markdown(html_path, start_marker="表 2：EAP 年度推動計畫甘特圖"):
    """
    將 HTML 檔案轉換為 Markdown

    Args:
        html_path: HTML 檔案路徑
        start_marker: 開始提取的標記（從此標記之後的內容開始提取）

    Returns:
        Markdown 格式的文本
    """
    # 讀取 HTML
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')

    # 找到所有結構化元素
    all_elements = soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'table'],
                                   attrs={'data-path-to-node': True})

    # 找到開始標記的位置
    start_index = -1
    for i, elem in enumerate(all_elements):
        if start_marker in elem.get_text():
            start_index = i
            break

    if start_index == -1:
        raise ValueError(f"找不到標記: {start_marker}")

    # 從標記之後開始提取
    markdown_lines = []
    markdown_lines.append(f"\n---\n")
    markdown_lines.append(f"\n## 📝 後續對話內容（從「{start_marker}」之後）\n")

    for elem in all_elements[start_index + 1:]:
        elem_name = elem.name

        if elem_name == 'h1':
            text = extract_clean_element_text(elem)
            markdown_lines.append(f"\n# {text}\n")

        elif elem_name == 'h2':
            text = extract_clean_element_text(elem)
            markdown_lines.append(f"\n## {text}\n")

        elif elem_name == 'h3':
            text = extract_clean_element_text(elem)
            markdown_lines.append(f"\n### {text}\n")

        elif elem_name == 'h4':
            text = extract_clean_element_text(elem)
            markdown_lines.append(f"\n#### {text}\n")

        elif elem_name == 'p':
            text = extract_clean_element_text(elem)
            if text:
                # 檢查是否是粗體開頭（可能是列表標題）
                if text.startswith('**') or elem.find('b'):
                    markdown_lines.append(f"\n{text}\n")
                else:
                    markdown_lines.append(f"{text}\n")

        elif elem_name == 'ul' or elem_name == 'ol':
            md_list = convert_list_to_markdown(elem)
            markdown_lines.append(f"\n{md_list}\n")

        elif elem_name == 'table':
            md_table = convert_table_to_markdown(elem)
            markdown_lines.append(f"\n{md_table}\n")

    return ''.join(markdown_lines)


def main():
    """主程序"""
    # 檔案路徑
    html_path = Path('/mnt/c/Users/user/Desktop/_Gemini - 直接與 Google AI 互動.html')
    output_path = Path('/mnt/c/Users/user/Documents/Yippine/Program/Checkinly/docs/chat/2025-12-30_Gemini對話_降低離職率與EAP研究_補充內容.md')

    print("=" * 60)
    print("🔄 Gemini HTML → Markdown 轉換腳本")
    print("=" * 60)

    print(f"\n📁 輸入檔案: {html_path}")
    print(f"📁 輸出檔案: {output_path}")

    try:
        # 轉換
        print("\n⏳ 正在提取和轉換...")
        markdown_content = html_to_markdown(html_path)

        # 寫入檔案
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)

        # 統計
        lines = markdown_content.split('\n')
        chars = len(markdown_content)

        print(f"\n✅ 轉換完成！")
        print(f"   • 行數: {len(lines):,}")
        print(f"   • 字符數: {chars:,}")
        print(f"   • 檔案大小: {chars / 1024:.1f} KB")

        print(f"\n📂 輸出位置: {output_path}")
        print("\n" + "=" * 60)

    except Exception as e:
        print(f"\n❌ 錯誤: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
