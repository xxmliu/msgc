$(function () {
  $('.search>.sort').on('click', 'li', function () {
    $(this).addClass('active').siblings().removeClass('active')
    // 切换排序方案后, 重新获取数据
    getData(1)
  })


  function getData(p) {
    // 读取地址栏中的kw属性的值, 通过url传递给服务器, 获取对应的搜索结果
    const kw = new URLSearchParams(location.search).get('kw')
    // 读取当前的排序类型
    const type = $('.search>.sort>li.active').data('type') //data-type

    var url = `https://serverms.xin88.top/mall/search?type=${type}&page=${p}&kw=${kw}`

    console.log('查询的URL:', url)

    $.get(url, data => {
      console.log('搜索数据:', data)

      $('.search-content').html(
        data.data.map(value => {
          const { name, pic, price, sale_count } = value

          // 把 标题中的搜索关键词 找出来, 变为红色
          // 思路: 
          // 1. 从字符串找到所有关键词, 如果是英文 则忽略大小写  
          // 2. 替换成 <span style="color:red;">关键词</span>
          // 技术点: 正则替换
          const reg = new RegExp(`(${kw})`, 'gi')
          console.log('正则:', reg)
          const name_re = name.replace(reg,
            '<span style="color:red;">$1</span>')
          console.log('替换后:', name_re)

          return `<li>
            <img src="./assets/img/mall/${pic}" alt="">
            <div>
              <h3>${name_re}</h3>
              <b>¥${price}</b>
              <span>销量:${sale_count}</span>
            </div>
          </li>`
        })
      )


      const { page, pageCount } = data

      let start = page - 2
      let end = page + 2

      if (start < 1) {
        start = 1
        end = start + 4
      }

      if (end > pageCount) {
        end = pageCount
        // 如果页数很少, 少于4页, 则起始值最小是1
        // max: 取参数中的最大值
        start = Math.max(end - 4, 1)
      }

      $('.search>.pages>ul').empty()

      for (let i = start; i <= end; i++) {
        $('.search>.pages>ul').append(
          `<li class="${page == i ? 'active' : ''}">${i}</li>`
        )
      }

      $(window).scrollTop(0)

      // 关于按钮不可用时的做法:
      // 利用 prop 方法, 修改按钮的 disabled 属性,  true代表不可用, false代表可用
      $('.search>.pages>.prev').prop('disabled', page == 1)
      $('.search>.pages>.next').prop('disabled', page == pageCount)
    })
  }

  getData(1)

  $('.search>.pages>ul').on('click', 'li', function () {
    getData(
      $(this).text()
    )
  })

  $('.search>.pages>.next').click(function () {
    const p = $('.search>.pages>ul>li.active').text() * 1
    getData(p + 1)
  })

  $('.search>.pages>.prev').click(function () {
    const p = $('.search>.pages>ul>li.active').text() * 1
    getData(p - 1)
  })
})