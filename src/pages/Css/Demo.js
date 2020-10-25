import React, { useState } from 'react';

export default function Demo() {
  const [flag, setFlag] = useState(true);
  return (
    <>
      <div className="flex-content">
        <button type="button" onClick={() => { setFlag(!flag); }}>切换内容</button>
        {flag ?
          <ul>
            <li>这是第一行</li>
            <li>这是第二行</li>
          </ul> :
          <ul>
            <li>这是第一行</li>
            <li>这是第二行</li>
            <li>这是第三行</li>
            <li>这是第四行</li>
            <li>这是第五行</li>
          </ul>
        }
      </div>
      <footer>
        这是一个动态吸底
      </footer>
    </>
  );
}
