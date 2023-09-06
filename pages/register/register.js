$(function () {
  // 手机输入框添加 获得焦点focus 和 失去焦点blur 的事件监听
  $('.phone>input')
    .focus(function () {
      // 获取焦点时, 删除报错提示
      // nextAll : 下方所有的兄弟元素
      $(this).removeClass('err').nextAll().hide()
    })
    .blur(function () {
      //1. 判断手机号格式是否合法
      var phone = $(this).val()

      // 输入框中没有值, 则不进行验证操作
      if (phone.length == 0) return

      // 正则验证
      if (/^1[3-9]\d{9}$/.test(phone)) {
        // 格式正确时, 到服务器查验手机号是否已经注册过
        var url = 'https://serverms.xin88.top/users/checkPhone'
        // POST请求: 适合上传数据, 具体请求方式由服务器规定
        // 特点: 请求地址与参数要分开写

        // 语法糖: { 属性名: 值 }   一旦值是变量, 变量名和属性名相同, 可以合写
        // {phone: phone}  => {phone}
        $.post(url, { phone }, data => {
          console.log('手机号验证结果:', data)

          if (data.code == 202) { // 202代表手机号已经注册过
            $(this).addClass('err')
            // last(): 最后一个元素
            $(this).nextAll().last().show()
          }

          if (data.code == 200) { // 未注册过
            $(this).next().show()
          }

        })

      } else {
        // 不对: 为输入框添加 err 样式类
        $(this).addClass('err')
        // 输入框 下方的 下方的 兄弟元素
        $(this).next().next().show()
      }
    })

  $('.password>input')
    .blur(function () {
      var pwd = $(this).val()

      var pwd_len = pwd.length
      if (pwd_len == 0) return // 空的,不做验证

      if (pwd_len >= 6 && pwd_len <= 12) {
        $(this).next().show()
      } else {
        $(this).addClass('err').next().next().show()
      }
    })
    .focus(function () {
      $(this).removeClass('err').nextAll().hide()
    })

  $('.re-pwd>input')
    .blur(function () {
      const $inp_pwd = $('.password>input')
      // const $inp_repwd = $('.re-pwd>input')
      console.log($(this).length);
      if ($(this).val().length == 0) return
      if ($inp_pwd.val().length == 0) return

      if ($inp_pwd.val() == $(this).val()) {
        $(this).next().show()
      } else {
        $(this).next().next().show()
      }
    })
    .focus(function () {
      $(this).removeClass('err').nextAll().hide()
    })

  // 点击事件: 注册
  $('.register>div>button').click(function () {
    const agree = $('.register>div>label>input').prop('checked')

    if (agree) {
      // 如果所有3个 p.ok 元素均可见, 说明都正确, 可以注册
      // :visible 限定可见的
      if ($('.register p.ok:visible').length == 3) {
        var url = 'https://serverms.xin88.top/users/register'
        // 读取输入框中的值. 变量名 故意与 参数名相同
        const phone = $('.phone>input').val()
        const pwd = $('.password>input').val()

        $.post(url, { phone, pwd }, data => {
          console.log('注册结果:', data);
          if (data.code == 200) {
            alert(`恭喜您成为第${data.id}位用户, 即将为您跳转到登录页面!`)
            // 替换操作: 没有历史记录, 无法返回到当前页
            location.replace('?p=login')
          } else {
            alert("注册失败!" + data.msg)
          }
        })
      } else {
        alert("请确保所有信息填写正确, 再进行注册")
      }
    } else {
      $('.register>div>label').addClass('animate__animated animate__heartBeat')
    }
  })

  // 动画结束时, 删除样式. 便于下次动画的添加
  $('.register>div>label').on('animationend', function () {
    $(this).removeClass('animate__heartBeat')
  })
})