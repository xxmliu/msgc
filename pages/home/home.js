$(function () {
  var url = 'https://serverms.xin88.top/index'

  $.get(url, data => {
    console.log('首页数据:', data)
    // 热门视频
    $('.hot-video>ul').html(
      data.hot_video.map(value => {
        const { mp4, vname } = value
        return `<li>
          <video src="./assets/video/${mp4}" preload="metadata"></video>
          <i></i>
          <b>${vname}</b>
        </li>`
      })
    )

    // 今日热搜
    $('.hot-search>div').html(
      data.today_hot.map(value => {
        const { name, emphasize } = value

        return `<a class="${emphasize ? 'active' : ''}" href="?p=search&kw=${name}">${name}</a>`
      })
    )

    // 今日三餐
    $('.today-meal>div:first-child>ul').html(
      data.today_meal.map((value, i) => {
        const { cate_name, contents } = value

        contents.forEach(content => {
          const { desc, pic, title } = content

          $('.swiper-wrapper').append(`<div class="swiper-slide">
            <img src="./assets/img/food/${pic}" alt="">
            <b>${title}</b>
            <p>${desc}</p>
          </div>`)
        })

        return `<li class="${i == 0 ? 'active' : ''}">${cate_name}</li>`
      })
    )

    // index_items
    $('.index-items').html(
      data.index_items.map(value => {
        const { title, items } = value

        // 需要把 items 数据转为 li 元素
        const lis = items.map(value => {
          const { author, desc, pic, title } = value
          return `<li>
            <div>
              <img src="./assets/img/food/${pic}" alt="">
              <span>${author}</span>
            </div>
            <b>${title}</b>
            <p>${desc}</p>
          </li>`
        })

        return `<div>
        <h2>${title}</h2>
        <ul>${lis.join('')}</ul>
        </div>`
      })
    )
  })

  // 委托方案, 为通过请求异步添加的元素增加事件
  $('.hot-video>ul').on('click', 'li', function () {
    // 被点击元素的3种情况: 已经激活, 未激活, 普通状态
    if ($(this).hasClass('active')) {
      // 已经激活的li 说明其中的视频在播放, 所以点击后要暂停
      $(this).children('video').trigger('pause')

      $(this).removeClass('active').siblings().removeClass('noactive')

    } else if ($(this).hasClass('noactive')) {
      // 当前元素非激活: 让自身中的视频播放, 让其他元素中的视频暂停
      $(this).children('video').trigger('play')
      $(this).siblings().children('video').trigger('pause')

      $(this).addClass('active').removeClass('noactive')
      // 周边元素都应该非激活, 且不带有激活样式
      $(this).siblings().addClass('noactive').removeClass('active')
    } else {
      // 普通状态下点击:
      $(this).addClass('active').siblings().addClass('noactive')
      // children() : 用于查找子元素
      // this是li元素, 其子元素中, video 标签, 触发其 play 方法
      $(this).children('video').trigger('play')
    }
  })

  $('.today-meal').on('click', 'li', function () {
    $(this).addClass('active').siblings().removeClass('active')

    const i = $(this).index()
    mySwiper.slideTo(3 * i)
  })


  var mySwiper = new Swiper('.swiper', {
    slidesPerView: 3,
    spaceBetween: 10,
    slidesPerGroup: 3,
    on: {
      slideChange() {
        const i = this.activeIndex / 3
        $('.today-meal li').eq(i).click()
      }
    }
  })

  // 每隔3秒, 切换一次动画
  setInterval(() => {
    $('.area-1-right').toggleClass('active')
  }, 3000);

})