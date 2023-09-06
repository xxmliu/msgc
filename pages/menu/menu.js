// 准备就绪的写法:
$(function () {
  // 函数封装实现复用: 点击不同的页数按钮, 请求对应的页数数据进行展示

  function getData(p) {
    var url = 'https://serverms.xin88.top/video?page=' + p

    $.get(url, data => {
      console.log('菜谱数据:', data);

      // 内容的展示
      $('.menu-content').html(
        data.data.map(value => {
          const { duration, pic, title, views } = value

          return `<li>
          <div>
            <img src="./assets/img/video/${pic}" alt="">
            <div>
              <span>${views}次播放</span>
              <span>${duration}</span>
            </div>
          </div>
          <p>${title}</p>
        </li>`
        })
      )

      // 分页的展示部分

      // 1. 根据请求到的总页数, 生成对应分页元素
      const { page, pageCount } = data

      // 难点: 实现最多显示5页的逻辑.  需要根据当前页数来判断 for循环的范围
      let start = page - 2
      let end = page + 2

      // 特例1: 需要特殊处理: 比如 起始值 最小是1
      if (start < 1) {
        start = 1
        end = start + 4
      }
      // 特例2: 结束值 最大为总页数
      if (end > pageCount) {
        end = pageCount
        start = end - 4
      }

      // 在新增页数按钮之前, 删除旧的按钮
      $('.menu>.pages>ul').empty() // empty: 清空子元素

      for (let i = start; i <= end; i++) {
        // i 和 当前页 相同时, 要添加激活样式
        $('.menu>.pages>ul').append(
          `<li class="${page == i ? 'active' : ''}">${i}</li>`
        )
      }

      // 上一页和下一页的隐藏操作
      if (page == 1) {
        $('.menu>.pages>.prev').hide()
      } else {
        $('.menu>.pages>.prev').show()
      }

      // 习惯: jQuery类型的对象, 用$开头, 达到见名知意的效果
      const $btn_next = $('.menu>.pages>.next')
      page == pageCount ? $btn_next.hide() : $btn_next.show()

      // 浏览器的缓存问题: 默认属于强缓存机制, 会自动存储所有下载的图片, 短时间内重复的请求 都会直接使用本地的图片, 实现节省流量, 提升速度

      // 统一体验: 当新的页面内容出现时, 直接滚动回到顶部
      // 参数代表 距离顶部的偏移量.   0 代表没有偏移
      $(window).scrollTop(0)
    })
  }

  // 初始化, 请求第一页
  getData(1)

  // li元素 是网络请求后动态新增的元素, 为其添加事件操作, 适合用委托方案
  $('.menu>.pages').on('click', 'li', function () {
    // li上的文本, 就是对应的页数
    const p = $(this).text()
    getData(p)
  })

  // 下一页: 一直存在, 不需要委托
  $('.menu>.pages>.next').click(function () {
    // 获取当前激活页上的数字. 利用 *1 把文本转数字, 避免后续的 字符串拼接问题
    const p = $('.menu>.pages>ul>li.active').text() * 1

    getData(p + 1)
  })

  // 上一页:
  $('.menu>.pages>.prev').click(function () {
    const p = $('.menu>.pages>ul>li.active').text()
    getData(p - 1)
  })
})