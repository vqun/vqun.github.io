define(function() {
  var $ = Saber, template = vTemplate;
  var templete = null, tpl = null, data = null;
  var request = $.Http.request;
  var View = new Rabbit.View({
    "onCreate": function() {
      console.log("index:created");
      var el = this.el;
      el.className = "saber-view saber-clear " + el.className;
      request("/views/templates/index.html", {
        "type": "text",
        "success": function(_tpl_) {
          tpl = _tpl_;
          templete = template(tpl);
          templete.compile();
          if(data) {
            el.innerHTML = templete.render(data)
          }
        }
      });
      request("/views/data/index.json", {
        "type": "json",
        "success": function(_data_) {
          data = _data_;
          if(templete&&templete.render) {
            el.innerHTML = templete.render(data)
          }
        }
      })
    },
    "onLoad": function() {
      console.log("index:loaded")
    },
    "onShow": function() {
      console.log("index:shown")
    },
    "onHide": function() {
      console.log("index:hidden")
    }
  });
  return View
})