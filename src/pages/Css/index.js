/* eslint-disable no-bitwise */
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'utils/util';
import FlexFooter from './Demo';
import style from './index.less';

const arr = new Array(35).fill(1).map((_, index) => ({
  key: index,
  label: `这是第${index}行`
}));

const pageSize = 10;

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
  const pageRef = useRef(1);

  const [tags, setTags] = useState(0);

  const fetchRef = useRef();

  useEffect(() => {
    fetchRef.current = () => {
      if (tags > 0) {
        return;
      }
      setTags(tags | 1);
      mockFetch(pageRef.current).then((data) => {
        if (data.length < pageSize) {
          setTags(2);
          if (!data.length) {
            return;
          }
        } else {
          setTags(0);
        }
        console.log('data', pageRef.current, data);
        pageRef.current += 1;
        setList([...list, ...data]);
      });
    };
  }, [list, tags]);

  useEffect(() => {
    // const demo = document.querySelector('#demo');
    // const content = document.querySelector('#content');
    // const titleHeight = document.querySelector('#title').clientHeight;
    // let fixed = false;
    // demo.addEventListener('scroll', (e) => {
    //   if (!fixed && e.target.scrollTop >= titleHeight) {
    //     fixed = true;
    //     content.classList.add('with-fixed');
    //   }

    //   if (fixed && e.target.scrollTop < titleHeight - 5) {
    //     content.classList.remove('with-fixed');
    //     fixed = false;
    //   }
    // });
    if (showDemo) {
      return;
    }
    const list = document.querySelector('#list');

    const debunceListener = debounce((e) => {
      if (list.scrollHeight - list.clientHeight - e.target.scrollTop < 50) {
        fetchRef.current();
      }
    }, 500);
    list.addEventListener('scroll', debunceListener);

    if (pageRef.current === 1) fetchRef.current(1);
  }, [showDemo]);

  return (
    <div id="demo" className={style.demo}>
      <h3 id="title" className="title">
        <div>这是一个概览头部：{showDemo ? '动态吸底' : '局部吸顶'}</div>
        <button type="button" onClick={() => { setDemo(!showDemo); }}>点击切换demo</button>
      </h3>
      {!showDemo ?
        <div id="content" className={`content ${(tags & 1) ? 'loading' : ''}`}>
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
  );
}
