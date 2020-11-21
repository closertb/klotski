/* eslint-disable no-bitwise */
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'utils/util';
import FlexFooter from './Demo';
// import style from './index.less';
import './index.less';

const arr = new Array(35).fill(1).map((_, index) => ({
  key: index,
  label: `这是第${index}行`
}));

const pageSize = 10;

const styleMaps = {
  0: 'js-fixed',
  1: 'sticky',
  2: 'viewport',
};

const nameMaps = {
  0: 'js-fixed',
  1: 'sticky',
  2: 'viewport',
};

const mockFetch = (page) => {
  const end = page * pageSize > arr.length ? arr.length : page * pageSize;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(arr.slice((page - 1) * pageSize, end));
    }, 1000);
  });
};

export default function CssDemo() {
  const [list, setList] = useState([]);
  const [showDemo, setDemo] = useState(false);
  const [sticky, setSticky] = useState(0);
  const pageRef = useRef(1);

  const [tags, setTags] = useState(0);

  const fetchRef = useRef();

  useEffect(() => {
    let status = 0;
    fetchRef.current = () => {
      //  这个写法还有优化的必要
      if (status > 0 || tags > 0) {
        return;
      }
      status |= 1;
      setTags(status);
      mockFetch(pageRef.current).then((data) => {
        if (data.length < pageSize) {
          status = 2;
          setTags(status);
          if (!data.length) {
            return;
          }
        } else {
          status = 0;
          setTags(status);
        }
        pageRef.current += 1;
        setList([...list, ...data]);
      });
    };
  }, [list, tags]);

  useEffect(() => {
    if (!sticky) {
      const demo = document.querySelector('#demo');
      const content = document.querySelector('#content');
      const titleHeight = document.querySelector('#title').clientHeight;
      let fixed = false;
      demo.addEventListener('scroll', (e) => {
        if (!fixed && e.target.scrollTop >= titleHeight) {
          fixed = true;
          content.classList.add('with-fixed');
        }

        if (fixed && e.target.scrollTop < titleHeight) {
          content.classList.remove('with-fixed');
          fixed = false;
        }
      });
    }
    if (showDemo) {
      return;
    }
    const list = document.querySelector(sticky < 2 ? '#demo' : '#list');

    const debunceListener = debounce((e) => {
      if (list.scrollHeight - list.clientHeight - e.target.scrollTop < 50) {
        fetchRef.current();
      }
    }, 500);
    list.addEventListener('scroll', debunceListener);

    if (pageRef.current === 1) fetchRef.current(1);
  }, [showDemo, sticky]);

  return (
    /* {style.demo } */
    <div className="demo">
      <div id="demo" className={`wrapper ${styleMaps[sticky]}  ${(tags & 1) ? 'loading' : ''}`}>
        <h3 id="title" className="title">
          <div>这是一个概览头部：{showDemo ? '动态吸底' : '局部吸顶'}</div>
          <div>
            <button type="button" onClick={() => { setDemo(!showDemo); }}>
              点击切换为{showDemo ? '吸底' : '吸顶'}
            </button>
            <button type="button" onClick={() => { setSticky((sticky + 1) % 3); }} className="ml-20">
              切换为{nameMaps[(sticky + 1) % 3] }
            </button>
          </div>
        </h3>
        {!showDemo ?
          <div id="content" className="content">
            <div className="filter-bar">
              <h3>这是列表头部</h3>
              <h3>可筛选</h3>
              <h3>下面是滚动列表</h3>
            </div>
            <ul id="list" className="list">
              {list.map(({ key, label }) => <li key={key}>{label}</li>)}
              {tags > 1 && <div className="btm-tips">我也是有底线的</div>}
            </ul>
          </div> : <FlexFooter />
        }
      </div>
    </div>
  );
}
