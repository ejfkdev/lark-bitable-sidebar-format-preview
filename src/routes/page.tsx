import { MarkdownRender, Radio, RadioGroup } from '@douyinfe/semi-ui';
import './index.css';
import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import { bitable } from '@lark-base-open/js-sdk';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import parserYaml from 'prettier/plugins/yaml';
import parserGraphql from 'prettier/plugins/graphql';
import parserHtml from 'prettier/plugins/html';
import parserMarkdown from 'prettier/plugins/markdown';
import parserEstree from 'prettier/plugins/estree';
import parserTypescript from 'prettier/plugins/typescript';

const parserMap: any = {
  html: 'html',
  xml: 'html',
  markdown: 'markdown',
  css: 'css',
  scss: 'css',
  less: 'css',
  yaml: 'yaml',
  graphql: 'graphql',
  pug: 'pug',
  json: 'json',
};

const Index = () => {
  const [mode, setMode] = useState('markdown');
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState('light');
  const contentRef = useRef<HTMLElement | null>(null);
  bitable.bridge.getTheme().then(theme => setTheme(theme.toLowerCase()));
  // 获取当前打开的表格
  useEffect(() => {
    hljs.highlightAll();
    const off = bitable.base.onSelectionChange(event => {
      console.log(event.data);
      if (!event.data.tableId || !event.data.fieldId || !event.data.recordId) {
        return;
      }
      bitable.base
        .getTable(event.data.tableId)
        .then(table =>
          table.getCellString(event.data.fieldId!, event.data.recordId!),
        )
        .then(str => {
          setContent(str);
        })
        .catch(e => console.log(e));
    });
    const off2 = bitable.bridge.onThemeChange(event => {
      setTheme(event.data.theme.toLowerCase());
    });
    return () => {
      off();
      off2();
    };
  }, []);
  useEffect(() => {
    import(`@public/css/atom-one-${theme}.css`).catch(err => {
      console.error(`Failed to load theme: ${err}`);
    });
  }, [theme]);
  useEffect(() => {
    const fn = async () => {
      if (contentRef.current && mode === 'code') {
        const result = hljs.highlightAuto(content);
        console.log(result);
        let txt = result.value;
        try {
          if (parserMap[result.language ?? '']) {
            txt = await prettier.format(
              content.replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
              {
                parser: parserMap[result.language ?? ''] ?? '',
                plugins: [
                  parserBabel,
                  parserYaml,
                  parserGraphql,
                  parserHtml,
                  parserMarkdown,
                  parserEstree,
                  parserTypescript,
                ],
              },
            );
          }
        } catch (error) {}
        contentRef.current.innerHTML = txt;
      }
    };
    fn();
  }, [content, mode]);

  return (
    <div className="flex flex-col items-center w-screen max-h-screen">
      <RadioGroup
        className="flex-shrink-0"
        defaultValue={mode}
        aria-label="markdown/code"
        type="button"
        buttonSize="large"
        onChange={e => setMode(e.target.value)}
      >
        <Radio value={`markdown`}>
          <div className="flex items-center gap-2">
            <span className="streamline--markdown-circle-programming"></span>
            markdown
          </div>
        </Radio>
        <Radio value={`code`}>
          <div className="flex items-center gap-2">
            <span className="fluent--code-circle-32-regular"></span>
            code
          </div>
        </Radio>
      </RadioGroup>
      <div className="relative flex flex-grow mb-4 p-4 w-screen text-wrap break-all whitespace-break-spaces overflow-y-auto">
        {mode === 'markdown' && (
          <MarkdownRender className="p-4 grow" raw={content} format="md" />
        )}
        {mode === 'code' && (
          <pre className="flex w-full grow">
            <code
              ref={contentRef}
              className={`grow w-full p-4 text-wrap break-all whitespace-break-spaces ${
                theme === 'dark' ? 'hljs dark' : 'hljs'
              }`}
            ></code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default Index;
