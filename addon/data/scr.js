var js = `
  var jsonp_callback = function(data){
    var result = JSON.parse(JSON.stringify(data));
    if(data["okay"] == "OK") {
      var close = document.getElementsByClassName("js-close-window")[0];
      if(close) {
        close.click();
      } else {
        close = document.getElementsByClassName("js-close-editor")[0];
        if(close) {
          close.click();
        }
      }
    }
  };

  var error_callback = function(data){
    alert(JSON.stringify(data));
  };

  var jsonp = function(action, card_id){
    var pkey = "MARKER";
    var baseurl = "https://hp.plop.in/trello?pkey=" + pkey ;
    var s = document.createElement("script");
    s.id = "jsonp";
    s.type = "text/javascript";
    s.src = baseurl + "&callback=jsonp_callback";
    s.src += "&action=" + action ;
    s.src += "&cardid=" + card_id ;
    document.head.appendChild(s);
    document.getElementById("jsonp").outerHTML="";
  };

  var get_card_area = function(){
    return document.getElementsByClassName("window-wrapper")[0];
  };

  var create_card_buttons = function(){
    var html_button = \`<h3>Perso</h3>
      <div class="u-clearfix">
      <a href="#" class="button-link"><span class="icon-sm icon-member"></span>Inbox</a>
      <a href="#" class="button-link"><span class="icon-sm icon-member"></span>Done</a>
      <a href="#" class="button-link"><span class="icon-sm icon-member"></span>Backlog</a>
      </div>\`;
    var div = document.createElement("div");
    div.innerHTML = html_button;
    var li = div.getElementsByClassName("button-link")
    var card_id = window.location.toString().split("/")[4]
    li[0].onclick = function(){jsonp("inbox", card_id);};
    li[1].onclick = function(){jsonp("done", card_id);};
    li[2].onclick = function(){jsonp("backlog", card_id);};
    return div
  };

  var card_area_callback = function(){
    var area = get_card_area();
    if (area.innerHTML != "") {
      var side_bar = area.getElementsByClassName("window-sidebar")[0];
      side_bar.insertBefore(create_card_buttons(), side_bar.firstChild.nextSibling);
    }
  };

  var get_id_quick_edit = function() {
    var c_name = document.getElementsByClassName("list-card-edit-title");
    var all_names = document.getElementsByClassName("list-card-title js-card-name");
    if(c_name.length == 1 && all_names.length >= 1){
      c_name = c_name[0].textContent;
      var result = [];
      [].forEach.call(all_names, function(elem, i) {
        if(elem.lastChild.textContent == c_name) {
          var id = elem.href.split("/")[4];
          result.push(id);
        }
      });
      if(result.length == 1) {
        return(result[0]);
      }
    }
  };

  var create_quick_button = function(name, action, card_id) {
    var div = document.createElement("div");
    var html_button = \`<a class="quick-card-editor-buttons-item" href="#">
      <span class="icon-sm icon-member light"></span>
      <span class="quick-card-editor-buttons-item-text">\${name}</span>
      </a>\`;
    div.innerHTML = html_button;
    html_button = div.firstChild;
    html_button.onclick = function(){jsonp(action, card_id);};
    return(html_button);
  };

  var quick_edit_callback = function(){
    if(global_lock == false) {
      var area = document.getElementsByClassName("quick-card-editor-buttons")[0];
      if(area){
        if(area.lastChild.textContent.trim() != "Backlog") {
          var card_id = get_id_quick_edit();
          if(card_id) {
            global_lock = true;
            area.appendChild(create_quick_button("Inbox", "inbox", card_id));
            area.appendChild(create_quick_button("Done", "done", card_id));
            area.appendChild(create_quick_button("Backlog", "backlog", card_id));
            area.removeChild(document.getElementsByClassName("quick-card-editor-buttons-item js-edit-members")[0]);
            area.removeChild(document.getElementsByClassName("quick-card-editor-buttons-item js-move-card")[0]);
            area.removeChild(document.getElementsByClassName("quick-card-editor-buttons-item js-copy-card")[0]);
            global_lock = false;
          }
        }
      }
    }
  };

  var global_lock = false;
  var quick_observer_conf = { childList: true, subtree: true };
  var quick_observer = new MutationObserver(quick_edit_callback);
  quick_observer.observe(document.body, quick_observer_conf);

  var observer = new MutationObserver(card_area_callback);
  var observer_config = { childList: true };
  var area = get_card_area();
  if (typeof(area) == "object") {
    observer.observe(get_card_area(), observer_config);
  }
`;

var scr = document.createElement('script');
scr.id = "plop";
scr.type = "text/javascript";
scr.innerHTML = js.replace("MARKER", private_key);
document.head.appendChild(scr);
