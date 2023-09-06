$(function () {
  function getData(p) {
    var url = 'https://serverms.xin88.top/note?page=' + p

    $.get(url, data => {
      console.log('笔记数据:', data)

      $('.note-content').html(
        data.data.map(value => {
          const { cover, favorite, head_icon, name, title } = value

          return `<li>
          <img src="./assets/img/note/${cover}" alt="">
          <p>${title}</p>
          <div>
            <div>
              <img src="./assets/img/note/${head_icon}" alt="">
              <span>${name}</span>
            </div>
            <span>${favorite}</span>
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

      $('.note>.pages>ul').empty()

      for (let i = start; i <= end; i++) {
        $('.note>.pages>ul').append(
          `<li class="${page == i ? 'active' : ''}">${i}</li>`
        )
      }

      const $btn_next = $('.note>.pages>.next')
      const $btn_prev = $('.note>.pages>.prev')

      page == 1 ? $btn_prev.hide() : $btn_prev.show()
      page == pageCount ? $btn_next.hide() : $btn_next.show()

      $(window).scrollTop(0)
    })
  }

  getData(1)

  $('.note>.pages>ul').on('click', 'li', function () {
    const p = $(this).text()
    getData(p)
  })

  $('.note>.pages>.next').on('click', function () {
    const p = $('.note>.pages>ul>li.active').text() * 1

    getData(p + 1)
  })

  $('.note>.pages>.prev').on('click', function () {
    const p = $('.note>.pages>ul>li.active').text() * 1

    getData(p - 1)
  })
})