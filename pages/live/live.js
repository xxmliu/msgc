$(function () {
  let pno = 1

  let loading = false

  function getData(p) {
    if ($('.nomore:visible').length == 1) return

    if (loading) return

    loading = true
    // type: ms 美食; yz 颜值; wzry 王者荣耀; LOL 英雄联盟;
    var url = `https://douyu.xin88.top/api/room/list?page=${p}&type=yz`

    $.get(url, data => {
      loading = false

      console.log('直播数据:', data);

      $('.live-content').append(
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
      // 因为一页数据太少, 所以如果是第一页请求完毕, 立刻请求第二页
      if (nowPage == 1) getData(2)

      pno = nowPage

      if (nowPage == pageCount) {
        $('.nomore').show()
        $('.loading').hide()
      } else {
        $('.nomore').hide()
        $('.loading').show()
      }
    })
  }

  getData(1)

  $(window).on('scroll', function () {
    const top = $(window).scrollTop()

    const win_h = $(window).height()
    const dom_h = $(document).height()
    const offset_bottom = dom_h - win_h

    if (top > offset_bottom - 150) {
      getData(pno + 1)
    }
  })
})