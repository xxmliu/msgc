$(function () {
  // 用变量存储当前页:
  let nowPage = 1

  // 问题: 请求速度特别慢的时候, 如果反复触发触底操作, 则会触发同一个页面的多次请求

  // 亮亮在蹲厕所, 速度特别慢.  如何防止在此期间 别人也进来一起蹲坑?
  // 解决方案: 锁门
  // 1. 先拉门,看看锁没锁
  // - 锁: 不做事
  // - 没锁: 进门 锁门 -> 开始... -> 结束后要 解锁.
  let loading = false // 加载中, 进行中

  function getData(p) {
    // 如果当前没有更多 .nomore 元素处于显示状态, 就说明没有更多数据了, 则不再发请求
    // :visible  查找可见的元素, 即非隐藏状态
    // console.log($('.nomore:visible'))
    // 如果查询到的 .nomore 元素, 处于可见状态下有一个, 说明 没有更多 已经显示. 则不再发请求
    if ($('.nomore:visible').length == 1) return

    // 先检查: 是否在发送中
    if (loading) return //如果正在请求中, 则终止后续动作

    loading = true // 当前的请求设置为 进行中...

    var url = 'https://serverms.xin88.top/mall?page=' + p

    $.get(url, data => {
      loading = false // 回调函数的执行 说明请求完成, 则 进行中 改为 假, 代表结束

      console.log('商城数据:', data)

      // 累加操作: append
      $('.mall-content').append(
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
      nowPage = page // 把当前页保存起来

      // 当前页 == 总页数, 显示没有更多
      if (page == pageCount) {
        $('.nomore').show()
        $('.loading').hide()
      } else {
        $('.nomore').hide()
        $('.loading').show()
      }
    })
  }

  getData(1)

  // 需求: 检测到滚动操作触底时, 发送请求获取下一页的数据
  $(window).on('scroll', function () {
    const top = $(window).scrollTop() //滚动距离

    const dom_h = $(document).height() //内容高
    const win_h = $(window).height() //窗口高
    const offset_bottom = dom_h - win_h

    // console.log(top, offset_bottom);
    // 因为滚动有小数点的偏差, 用等号比较太严格
    // 所以: 把触底距离 - 10像素, 然后用 大于方式判断
    // 为了提升用户体验, 可以让触底操作更早一些触发, 让用户感觉不到加载操作
    if (top > offset_bottom - 150) {
      // alert("触底!!  请求下一页数据!")

      getData(nowPage + 1)
    }
  })
})