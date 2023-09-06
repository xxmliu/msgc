$(function () {
  function getData(p) {
    var url = `https://douyu.xin88.top/api/room/list?page=${p}&type=ms`

    $.get(url, data => {
      console.log('直播数据:', data);

      $('.live-content').html(
        data.data.list.map(value => {
          const { hn, nickname, roomName, roomSrc } = value

          return `<li>
          <div>
            <img src="${roomSrc}" alt="">
            <p class="hn">${hn}</p>
            <p class="nickname">${nickname}</p>
          </div>
          <p>${roomName}</p>
        </li>`
        })
      )

      const { nowPage, pageCount } = data.data

      let start = nowPage - 2
      let end = nowPage + 2

      if (start < 1) {
        start = 1
        end = start + 4
      }
      if (end > pageCount) {
        end = pageCount
        start = end - 4
      }

      $('.live > .pages>ul').empty()

      for (let i = start; i <= end; i++) {
        $('.live>.pages>ul').append(
          `<li class="${nowPage == i ? 'active' : ""}">${i}</li>`
        )
      }

      const $btn_next = $('.live>.pages>.next')
      const $btn_prev = $('.live>.pages>.prev')

      nowPage == 1 ? $btn_prev.hide() : $btn_prev.show()
      nowPage == pageCount ? $btn_next.hide() : $btn_next.show()

      $(window).scrollTop(0)
    })
  }

  getData(1)
  // 默认1页的数据太少, 导致页面可能无法滚动, 无法触发触底操作
  getData(2)

  $('.live>.pages>ul').on('click', 'li', function () {
    const p = $(this).text()
    getData(p)
  })

  $('.live>.pages>.next').on('click', function () {
    const p = $('.live>.pages>ul>li.active').text() * 1
    getData(p + 1)
  })

  $('.live>.pages>.prev').on('click', function () {
    const p = $('.live>.pages>ul>li.active').text() * 1
    getData(p - 1)
  })
})