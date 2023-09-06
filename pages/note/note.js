$(function () {
  // 获取某个元素的底部偏移量 = 元素的top值 + 元素的高
  function getBottom(el) {
    // 元素的顶部 top
    const top = $(el).css('top') // 大概: '10px'   
    // 获取高度
    const height = $(el).height() // 获取的是值, 例如 20
    // console.log({ top, height })
    // 如何把 '10px' 转为数字 10
    // 通过 parseFloat 转化
    return parseFloat(top) + height
  }

  let pno = 1

  let loading = false

  function getData(p) {
    // 如果 .nomore 元素, 已经处于显示状态, 则不再发请求
    if ($('.nomore:visible').length == 1) return

    if (loading) return

    loading = true

    var url = 'https://serverms.xin88.top/note?page=' + p

    $.get(url, data => {
      loading = false

      console.log('笔记数据:', data)

      $('.note-content').append(
        data.data.map(value => {
          // 为什么服务器要提供宽和高?
          // 因为我们的图片属于网络图, 涉及到异步加载, 只有加载完毕后才能得到图片的宽高, 无法满足当前的需求
          const { cover, favorite, head_icon, name, title, width, height } = value

          // 图片有两种宽度, 这种宽高比一定相同, 应该等比例计算
          // 1. 原始宽高
          // 2. 显示宽高
          const img_w = 242.5 //显示的宽度
          const img_h = img_w * height / width  //显示时的高度

          return `<li>
          <img src="./assets/img/note/${cover}" 
          style="width:${img_w}px; height:${img_h}px" alt="">
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

      // 对所有已添加到页面上的li 进行位置的计算
      // each 类似数组的 forEach, 是jQuery提供的用于遍历查询到的元素的方法
      // 参数1: 序号;  参数2: 元素;

      // 声明1个数组, 存放已经布局完毕的元素(每一列中最下方的那个), 便于后续查找这些元素中最矮的
      const els = []

      $('.note-content>li').each((i, el) => {
        console.log(i, el)
        // 读取宽度
        const w = $(el).width()
        // 对前4个元素进行布局: 即序号 0 1 2 3 的元素
        if (i < 4) {
          $(el).css({ left: i * w + i * 10, top: 0 })
          els.push(el) // 存储在数组中
        } else {
          // 这里是对 非前4个元素进行布局的位置. 每次布局都要找到已经布局的元素中, 底部最矮的

          // 默认设置数组中 第一个元素最小
          let el_min = els[0]

          els.forEach(elem => {
            // var b = getBottom(elem)
            // console.log('元素底部:', b)
            // 判断: 当前遍历的元素 和 已知最小的元素 哪个更小
            if (getBottom(elem) < getBottom(el_min)) {
              el_min = elem // 把当前元素设置为最小的元素
            }
          })

          console.log('找到最小元素:', el_min);

          $(el).css({
            left: $(el_min).css('left'), // 左侧对齐
            top: getBottom(el_min) + 10, // 较小元素底部 下方10px
          })

          // 新的元素摆放后, 则其称为当前列中最下方的元素, 则需要对应替换掉 els 数组中的元素
          // 1. 获取当前最小元素的序号
          const index = els.indexOf(el_min)
          // 2. 把此元素替换成新增的元素, 作为这一列中最下方的
          els.splice(index, 1, el)

        }
      })

      // 由于所有的li都是绝对定位方式, 导致其父元素 高度坍塌, 影响下方的 脚部栏位置
      // 手动找到 els 数组中, 底部最大的那个, 这就是父元素应该具备的高度
      // 然后js 设置给父元素即可
      let el_max = els[0]

      els.forEach(el => {
        if (getBottom(el) > getBottom(el_max)) {
          el_max = el //如果遍历的元素 比 当前最大的 还要大, 就替换
        }
      })
      // 把这个最大元素的底部位置, 设置为父元素的高
      $('.note-content').height(
        getBottom(el_max)
      )

      const { page, pageCount } = data

      pno = page

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