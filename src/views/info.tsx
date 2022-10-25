import React from 'react';

const Info: React.FC = () => {
	return (
		<div className='info'>
			<h2>关于</h2>
			<p>
				这是 Gabriele Cirulli 的《2048》游戏的重新实现，使用React,
				Redux和TypeScript构建。与其他基于react的实现不同，这里只使用功能组件。这个项目不依赖于画布或元素引用。
			</p>
			<p>
				由<a href='https://github.com/Exiaoqing'>@E</a>开发。原作者<a href='https://github.com/mat-sz'>@mat-sz</a>
			</p>
		</div>
	);
};
export default Info;
