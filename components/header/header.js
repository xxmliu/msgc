$(function () {
  // 根据 存储空间中 是否有用户的信息, 来判定目前的登录状态, 显示对应的内容
  // 存储的是 JSON字符串, 要转为 对象再使用
  const user = JSON.parse(
    // 逻辑短路方案: 用户不一定是长期还是短期存储, 所以两个位置都要读, 哪个能读到就用哪个
    sessionStorage.getItem('user') || localStorage.getItem('user')
  )
  // 用户存在: 显示 用户信息 隐藏 登录按钮.
  if (user) {
    $('.header>a').hide()
    $('.header>.user').show()
    // 把用户的手机号 显示到 页面上
    $('.header>.user>a').text(user.phone)
    // 判断头像 avatar 属性是否有值, 如果有则设置个性化的头像
    if (user.avatar) $('.header>.user>img').prop('src', user.avatar)
  } else {
    $('.header>a').show()
    $('.header>.user').hide()
  }


  // 保持输入框的值, 不要因为刷新而丢失
  const kw = new URLSearchParams(location.search).get('kw')
  $('.header>.search>input').val(kw) // 输入框.value = kw


  $('.search>button').click(function () {
    // 读取搜索框中的值, 拼接到地址栏参数中
    // kw ->  keyword 关键词
    const kw = $('.header>.search>input').val() //读取 value 

    // 通过代码修改 location 地址
    location.assign('?p=search&kw=' + kw)
  })

  // 在输入框中按 回车按钮 也能触发搜索操作
  // keyup: 按键抬起时触发
  $('.header>.search>input').on('keyup', function (e) {
    // console.log('键盘事件:', e)
    // 按键编号 13 代表回车
    if (e.keyCode == 13) {
      //触发搜索按钮的点击事件
      $(this).next().click()
      // next: 下一个兄弟元素
    }
  })

  // 利用定时器为 logo 新增动画
  setInterval(() => {
    $('.header>img').addClass('animate__animated animate__rubberBand')
  }, 4000);

  $('.header>img').on('animationend', function () {
    $(this).removeClass('animate__rubberBand')
  })
})