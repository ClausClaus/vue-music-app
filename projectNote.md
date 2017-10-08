## Vue-music-app项目笔记

> 1.0  获取数据的方式
>
> > 通过chrome的netWork查看页面请求，找到需要请求的数据。qq音乐地址（https://m.y.qq.com/）
> >
> > jsonp原理：动态创建script标签，标签的src属性是不受同源策略限制的,
> >
> > 在请求的地址后面带上一个callback函数，函数名称就是在服务端定义好的方法名称，需要与后端事先沟通。在__qq音乐中的轮播图数据使用的jsonp回调函数叫做__jsonpCallback__。
> >
> > 遇到的坑：  做jsonp请求别人家的数据时，需要看准传递的参数有哪些，按套路出牌。。。

>2.0 轮播图组件
>
>>通过jsonp请求轮播图组件回来后，在轮播图组件中使用`<slot></slot>`的方式放入图片数据，循环渲染是在父组件中操作。
>>
>>给每张图片动态设置宽度，需要确保图片已经渲染完毕。注意父组件请求轮播图片数据的响应时间
>>
>>遇到的坑： 父组件轮播数据还未请求回来，请求轮播图数据是在父组件的created()中操作的，而设置轮播图片宽高添加类名的操作是在轮播图组件的mounted()中操作的，这些钩子函数隶属于同一个Vue实例对象。请求数据是异步请求，导致设置宽高类名的时机不对。需要在父组件模板文件中包含轮播图组件的父元素中设置判断条件。`v-if("sliderdata.length")` ，确保存放轮播图数据的对象有内容之后再渲染轮播图组件。

>3.0 scroll滚动组件
>
>>将滑动组件抽象为一个单独的组件，使用`<slot></slot>`插槽的方式将需要被滚动的数据放入其中，注意引用方需要增加一个直接子元素的`<div></div>` 包裹被滚动的元素。在scroll.vue组件中，使用vue实例生命周期methods对象定义方法代理better-scroll实例的方法。添加props对象使引用方可自定义scroll.vue组件。组件渲染时机需要精准把握，确保dom已经渲染完毕better-scroll才能正确的计算被滚动元素的高度。

> 4.0 listview快速列表组件
>
> > `onShortcutTouchStart()`
> >
> > 1.0 为快速列表中的每一项监听一个touchStart事件，获取事件源对象与当前事件源对象的下标。
> >
> > 1.1 调用scroll.vue组件中代理的scrollToElement方法。参数为快速列表中的事件源对象下标。
> >
> > `onShortcutTouchMove()`
> >
> > 2.0 为整个快速列表监听一个touchMove事件，阻止冒泡与默认行为。
> >
> > 2.1 在touchStart事件中记录点击的位置e.touches[0].pageY纵轴的偏移量 ==> [ y1 ]
> >
> > 2.2 在touchMove事件中再次获取e.touches[0].pageY纵轴的偏移量。==> [ y2 ]
> >
> > 2.3  Math.floor( y2  -  y1   /  单个字母的高度 )   =   __总共偏移了多少个快速列表项元素__
> >
> > 3.3 在touchStart中记录起来的事件 __源对象下标__  + __总共偏移了多少个快速列表项元素__ =  此次touchMove事件中需要滚动到的对应下标
> >
> > 3.4 调用scroll.vue组件中代理的scrollToElement方法，参数为  __此次touchMove事件中需要滚动到的对应下标__
> >
> > #### 滚动歌手列表时快速列表中的项与歌手列表中的标题对应上时实时高亮效果`_calculateHeight()`
> >
> > > 1.0 获取歌手列表中每一项的高度。存入数组当中。
> > >
> > > 2.0 在生命周期watch对象中监听在data方法中定义的scroolY属性，scrollY属性的值就是响应从scroll.vue组件发射过来的scroll事件中的当前滚动位置Y坐标值。
> > >
> > > 3.0 遍历this.listHeight数组，当中记录的是每一个歌手列表项的高度。
> > >
> > > 4.0 生命两个变量，height[ i ] 作为上限，height[ i + 1 ] 作为下限。
> > >
> > > 5.0 if判断当前scrollY滚动到的位置，当他大于上线但是小于下限时。获取当前的__[ i ]__作为当前下标`currentIndex`的值。
> > >
> > > 6.0 在组件模板中添加__`:class="{'current':currentIndex === index}"`__，为当前滚动到的下标项添加高亮效果
> > >
> > > ``````javascript
> > > watch:{
> > >         scrollY(newY) {
> > >       const listHeight = this.listHeight;
> > >       // 当滚动到顶部，newY > 0
> > >       if (newY > 0) {
> > >         this.currentIndex = 0;
> > >         return;
> > >       }
> > >       // 在中间部分滚动
> > >       for (var i = 0; i < listHeight.length; i++) {
> > >         let height1 = listHeight[i];
> > >         let height2 = listHeight[i + 1];
> > >         if (-newY >= height1 && -newY < height2) {
> > >           this.currentIndex = i;
> > >           return;
> > >         }
> > >       }
> > >       // 当滚动到底部，且-newY大于最后一个元素的上限
> > >       this.currentIndex = listHeight.length - 2;
> > >     }
> > > }    
> > > ``````
> > >
> > > 
> >
> > ##### 遇到的坑
> >
> > 加减法操作的返回的必须是数字类型。 