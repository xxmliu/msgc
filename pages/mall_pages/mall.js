$(function () {
  function getData(p) {
    var url = 'https://serverms.xin88.top/mall?page=' + p

    $.get(url, data => {
      console.log('商城数据:', data)

      $('.mall-content').html(
        data.data.map(value => {
          const { name, pic, price, sale_count } = value

          return `<li>
          <img src="./assets/img/mall/${pic}" alt="">
          <p>${name}</p>
          <div>
            <b>¥${price}</b>
            <span>月售${sale_count}</span>
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
        start = end - 4
      }

      $('.mall>.pages>ul').empty()

      for (let i = start; i <= end; i++) {
        $('.mall>.pages>ul').append(
          `<li class="${page == i ? 'active' : ''}">${i}</li>`
        )
      }

      const $btn_next = $('.mall>.pages>.next')
      page == pageCount ? $btn_next.hide() : $btn_next.show()

      const $btn_prev = $('.mall>.pages>.prev')
      page == 1 ? $btn_prev.hide() : $btn_prev.show()


      $(window).scrollTop(0)
    })
  }

  getData(1)

  $('.mall > .pages').on('click', 'li', function () {
    const p = $(this).text()
    getData(p)
  })

  $('.mall>.pages>.next').on('click', function () {
    const p = $('.mall>.pages>ul>li.active').text() * 1

    getData(p + 1)
  })

  $('.mall>.pages>.prev').on('click', function () {
    const p = $('.mall>.pages>ul>li.active').text() * 1

    getData(p - 1)
  })
})