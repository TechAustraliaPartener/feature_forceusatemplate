!function(t) {
  "use strict";
  t = t && t.hasOwnProperty("default") ? t.default : t,
  function() {
      if (!document.scrollingElement) {
          var t = null;
          Object.defineProperty(document, "scrollingElement", {
              get: function() {
                  if (t)
                      return t;
                  if (document.body.scrollTop)
                      return t = document.body;
                  var e = document.createElement("iframe");
                  e.style.height = "1px",
                  document.documentElement.appendChild(e);
                  var i = e.contentWindow.document;
                  i.write('<!DOCTYPE html><div style="height:9999em">x</div>'),
                  i.close();
                  var n = i.documentElement.scrollHeight > i.body.scrollHeight;
                  return e.parentNode.removeChild(e),
                  t = n ? document.documentElement : document.body
              }
          })
      }
  }();
  var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
      return typeof t
  }
  : function(t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
  }
    , i = function(t, e) {
      if (!(t instanceof e))
          throw new TypeError("Cannot call a class as a function")
  }
    , n = function() {
      function t(t, e) {
          for (var i = 0; i < e.length; i++) {
              var n = e[i];
              n.enumerable = n.enumerable || !1,
              n.configurable = !0,
              "value"in n && (n.writable = !0),
              Object.defineProperty(t, n.key, n)
          }
      }
      return function(e, i, n) {
          return i && t(e.prototype, i),
          n && t(e, n),
          e
      }
  }()
    , a = ".de.collapsible"
    , s = {
      COLLAPSED: "de-is-collapsed"
  }
    , r = {
      CLICK: "click" + a,
      HIDE: "hide" + a,
      HIDDEN: "hidden" + a,
      SHOW: "show" + a,
      SHOWN: "shown" + a
  }
    , o = {
      actionAttr: "data-de-collapsible-action",
      defaultAction: "toggle",
      parent: null,
      targetAttr: "data-de-collapsible-target"
  }
    , l = function() {
      function a(e, n) {
          var r = this;
          if (i(this, a),
          this._element = t(e),
          this._settings = n,
          this._id = this._element.attr("id"),
          this._state = {
              collapsed: this._element.hasClass(s.COLLAPSED),
              transitioning: !1
          },
          this._controlElements = t(this._id && "[" + this._settings.targetAttr + '="' + this._id + '"]').each(function(t, e) {
              return r._initControl(e)
          }),
          this._parentElement = t(this._settings.parent && "#" + this._settings.parent),
          this._siblingElements = t(),
          this._parentElement.length > 0) {
              var o = this._parentElement.find('[data-parent="' + this._parentElement.attr("id") + '"]')
                , l = o.not("." + s.COLLAPSED).first();
              this._siblingElements = this._siblingElements.add(o.not(this._element)),
              l.is(this._element) && this._hideSiblings()
          }
          this._updateAria()
      }
      return n(a, [{
          key: "toggle",
          value: function(t) {
              void 0 === t && (t = this._state.collapsed),
              t ? this.show() : this.hide()
          }
      }, {
          key: "show",
          value: function() {
              !this._state.transitioning && this._state.collapsed && (this._element.trigger(r.SHOW),
              this._state.transitioning = !0,
              this._hideSiblings(),
              this._element.removeClass(s.COLLAPSED),
              this._state.collapsed = !1,
              this._updateAria(),
              this._state.transitioning = !1,
              this._element.trigger(r.SHOWN))
          }
      }, {
          key: "hide",
          value: function() {
              this._state.transitioning || this._state.collapsed || (this._element.trigger(r.HIDE),
              this._state.transitioning = !0,
              this._element.addClass(s.COLLAPSED),
              this._state.collapsed = !0,
              this._updateAria(),
              this._state.transitioning = !1,
              this._element.trigger(r.HIDDEN))
          }
      }, {
          key: "_hideSiblings",
          value: function() {
              var t = this._siblingElements.not("." + s.COLLAPSED);
              t.length > 0 && a._jQueryInterface.call(t, "hide")
          }
      }, {
          key: "_initControl",
          value: function(e) {
              var i = this
                , n = (e = t(e).attr("aria-controls", this._id)).attr(this._settings.actionAttr) || this._settings.defaultAction;
              if (void 0 === this[n])
                  throw new Error('No method named "' + n + '"');
              e.on(r.CLICK, function(t) {
                  e.is("a") && t.preventDefault(),
                  i[n]()
              })
          }
      }, {
          key: "_updateAria",
          value: function() {
              this._element.attr("aria-hidden", this._state.collapsed ? "true" : "false"),
              this._controlElements.attr("aria-expanded", this._state.collapsed ? "false" : "true"),
              this._controlElements.filter("[" + this._settings.actionAttr + '="show"]').attr("aria-disabled", this._state.collapsed ? "false" : "true"),
              this._controlElements.filter("[" + this._settings.actionAttr + '="hide"]').attr("aria-disabled", this._state.collapsed ? "true" : "false")
          }
      }], [{
          key: "_jQueryInterface",
          value: function(i) {
              for (var n = arguments.length, s = Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
                  s[r - 1] = arguments[r];
              return this.each(function() {
                  var n = t(this)
                    , r = n.data("de.collapsible")
                    , l = t.extend({}, o, n.data(), "object" === (void 0 === i ? "undefined" : e(i)) && i);
                  if (r || (r = new a(this,l),
                  n.data("de.collapsible", r)),
                  "string" == typeof i) {
                      var d;
                      if (void 0 === r[i])
                          throw new Error('No method named "' + i + '"');
                      (d = r)[i].apply(d, s)
                  }
              })
          }
      }]),
      a
  }();
  t.fn.collapsible = l._jQueryInterface;
  var d, c = {
      INIT: "de-is-initialized",
      ACTIVE: "de-is-active",
      POPPING: "de-is-popping",
      POPPED: "de-is-popped",
      PUSHING: "de-is-pushing",
      PUSHED: "de-is-pushed"
  }, u = {
      CLICK: "click.de.slideViews",
      TRANSITION_END: "transitionend.de.slideViews"
  }, h = {
      views: ".js-de-SlideViews-view",
      actionAttr: "data-de-slideViews-action",
      targetAttr: "data-de-slideViews-target",
      defaultAction: "push"
  }, f = t("#demo-side"), g = [], p = function() {
      function a(e, n) {
          var s = this;
          i(this, a),
          this._element = t(e),
          this._settings = n,
          this._views = this._element.find(this._settings.views),
          this._controls = this._element.find("[" + this._settings.targetAttr + "]"),
          this._state = {
              transitioning: !1,
              activeView: null
          };
          var r = this._getActiveView();
          r.length > 1 ? r.not(r.first()).removeClass(c.ACTIVE) : 0 === r.length && this._views.first().addClass(c.ACTIVE),
          this._state.activeView = this._getActiveViewID(),
          this._controls.each(function(e, i) {
              var n = (i = t(i)).attr(s._settings.targetAttr)
                , a = i.attr(s._settings.actionAttr) || s._settings.defaultAction;
              console.log(s._settings.targetAttr),
              i.on(u.CLICK, function(t) {
                  t.preventDefault(),
                  s[a]("#" + n)
              })
          }),
          this._element.addClass(c.INIT),
          this._setInitialAria(),
          this._updateAria()
      }
      return n(a, [{
          key: "push",
          value: function(t) {
              g.push(f.scrollTop()),
              this._slideTo(t)
          }
      }, {
          key: "pop",
          value: function(t) {
              this._slideTo(t, !0),
              f.scrollTop(g.pop())
          }
      }, {
          key: "_getActiveView",
          value: function() {
              return this._views.filter("." + c.ACTIVE)
          }
      }, {
          key: "_getActiveViewID",
          value: function() {
              var t = this._getActiveView();
              return t.length > 0 ? t[0].id : null
          }
      }, {
          key: "_getViewControls",
          value: function(e) {
              return t(e).find("[" + this._settings.targetAttr + "]")
          }
      }, {
          key: "_slideTo",
          value: function(e, i) {
              var n = this;
              if (e = t(e),
              !this._state.transitioning && !e.hasClass(c.ACTIVE)) {
                  this._updateState({
                      transitioning: !0
                  });
                  var a = this._views.filter("." + c.ACTIVE)
                    , s = i ? c.PUSHING : c.POPPING
                    , r = i ? c.PUSHED : c.POPPED
                    , o = i ? c.POPPING : c.PUSHING
                    , l = i ? c.POPPED : c.PUSHED;
                  a.addClass(r + " " + s),
                  e.addClass(c.ACTIVE + " " + o),
                  a.on(u.TRANSITION_END, function(e) {
                      t(e.target).is(a) && (a.off(u.TRANSITION_END),
                      a.removeClass(c.ACTIVE + " " + s + " " + r))
                  }),
                  e.on(u.TRANSITION_END, function(i) {
                      t(i.target).is(e) && (e.off(u.TRANSITION_END),
                      e.removeClass(o + " " + l),
                      n._updateStateAndAria({
                          transitioning: !1
                      }))
                  }),
                  a.outerWidth() && a.removeClass(r),
                  e.outerWidth() && e.addClass(l)
              }
          }
      }, {
          key: "_updateStateAndAria",
          value: function(t) {
              this._updateState(Object.assign({}, t, {
                  updateActiveView: !0
              })),
              this._updateAria()
          }
      }, {
          key: "_updateState",
          value: function() {
              var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
                  transitioning: !1,
                  updateActiveView: !1
              };
              this._state.transitioning = t.transitioning,
              t.updateActiveView && (this._state.activeView = this._getActiveViewID())
          }
      }, {
          key: "_setInitialAria",
          value: function() {
              var e = this;
              this._controls.each(function(i, n) {
                  var a = t(n).attr(e._settings.targetAttr);
                  t(n).attr("aria-controls", a)
              })
          }
      }, {
          key: "_updateAria",
          value: function() {
              var e = this;
              this._views.each(function(i, n) {
                  var a = t(n)
                    , s = a.attr("id") === e._state.activeView
                    , r = e._getViewControls(n);
                  a.attr("aria-hidden", s ? "false" : "true"),
                  r.attr("aria-expanded", s ? "true" : "false")
              }, this)
          }
      }], [{
          key: "_jQueryInterface",
          value: function(i) {
              for (var n = arguments.length, s = Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
                  s[r - 1] = arguments[r];
              return this.each(function() {
                  var n = t(this)
                    , r = n.data("de.slideViews")
                    , o = t.extend({}, h, n.data(), "object" === (void 0 === i ? "undefined" : e(i)) && i);
                  if (r || (r = new a(this,o),
                  n.data("de.slideViews", r)),
                  "string" == typeof i) {
                      var l;
                      if (void 0 === r[i])
                          throw new Error('No method named "' + i + '"');
                      (l = r)[i].apply(l, s)
                  }
              })
          }
      }]),
      a
  }();
  t.fn.slideViews = p._jQueryInterface,
  window.NodeList && !NodeList.prototype.forEach && (NodeList.prototype.forEach = function(t, e) {
      e = e || window;
      for (var i = 0; i < this.length; i++)
          t.call(e, this[i], i, this)
  }
  ),
  "function" != typeof (d = window.Element.prototype).matches && (d.matches = d.msMatchesSelector || d.mozMatchesSelector || d.webkitMatchesSelector || function(t) {
      for (var e = (this.document || this.ownerDocument).querySelectorAll(t), i = 0; e[i] && e[i] !== this; )
          ++i;
      return Boolean(e[i])
  }
  ),
  "function" != typeof d.closest && (d.closest = function(t) {
      for (var e = this; e && 1 === e.nodeType; ) {
          if (e.matches(t))
              return e;
          e = e.parentNode
      }
      return null
  }
  );
  var m, v = "data-de-page-wrap-target", _ = (m = new Map,
  function(t) {
      var e = t.targetEl
        , i = t.callback;
      m.has(e) || (m.set(e, function(t) {
          !function(t) {
              var e = t.keyboardEvent
                , i = t.targetEl
                , n = t.callback;
              (function(t) {
                  return "false" === t.getAttribute("aria-hidden")
              }
              )(i) && "escape" === e.key.toLowerCase() && n(i)
          }({
              keyboardEvent: t,
              targetEl: e,
              callback: i
          })
      }),
      document.body.addEventListener("keydown", m.get(e), !0))
  }
  );
  t(".js-de-Collapsible").collapsible(),
  t(".js-de-SlideViews").slideViews();
  var y = document.querySelector(".js-de-PageWrap");
  y && function(t) {
      var e = t.targetEl
        , i = document.querySelectorAll('[data-de-page-wrap-fix~="scroll"]')
        , pw = document.querySelector('.de-PageWrap-main')
        , n = null
        , a = 0
        , s = 0
        , r = void 0
        , o = function(t) {
          n || (s = document.scrollingElement.scrollTop),
          n = t.getAttribute(v),
          a = Date.now(),
          u(t, pw)
      }
        , l = function(t) {
          n = null,
          u(t, pw)
      }
        , d = function(t) {
          var e = t.getAttribute(v)
            , i = document.getElementById(e);
          setTimeout(function() {
              e !== n || t.matches(":hover") || i.matches(":hover") || l(t)
          }, 600)
      }
        , spw = function () {
          setTimeout(function() {
            document.querySelector('.de-is-open') === null && pw.classList.remove("--fixed")
        }, 600)
      }
        , c = e.querySelectorAll("[" + v + "]");
      c = [].concat(function(t) {
          if (Array.isArray(t)) {
              for (var e = 0, i = Array(t.length); e < t.length; e++)
                  i[e] = t[e];
              return i
          }
          return Array.from(t)
      }(c)).map(function(t) {
          if ("A" === t.tagName) {
              for (var e = document.createElement("button"), i = 0; i < t.attributes.length; i++) {
                  var s = t.attributes[i];
                  "href" !== s.name && e.setAttribute(s.name, s.value)
              }
              e.innerHTML = t.innerHTML,
              t.parentNode.replaceChild(e, t),
              t = e
          }
          t.addEventListener("click", function() {
              t.getAttribute(v) === n && Date.now() - 200 < a || function(t) {
                  n === t.getAttribute(v) ? l(t) : o(t)
              }(t)
          });
          var r, d = (r = t.getAttribute(v),
          document.getElementById(r));
          return d && _({
              targetEl: d,
              callback: l
          }),
          t
      }),
      e.querySelectorAll("[" + v + "][data-de-page-wrap-hover=true]").forEach(function(t) {
        var e = document.getElementById(t.getAttribute(v));
        e && (t.addEventListener("mouseenter", function() {
          !function(t) {
            pw.classList.add('--fixed')
            clearTimeout(r),
            r = setTimeout(function() {
              o(t)
            }, 100)
          }(t)
          
        }),
        t.addEventListener("mouseleave", function() {
          d(t),
          clearTimeout(r)
          spw()
        }),
        e.addEventListener("mouseleave", function() {
          spw()
          return d(t)
        }))
      }),
      e.querySelectorAll('[data-de-page-wrap-action="closeMenu"]').forEach(function(t) {
          t.addEventListener("click", function(e) {
              e.target.closest("[data-de-page-wrap-cancel]") || l(t)
          })
      });

      var u = function(t) {
          var e = function(t) {
              return new RegExp("^(toggleMenu|closeMenu)$").test(t.getAttribute("data-de-page-wrap-action"))
          }(t)
            , a = "toggleExpand" === t.getAttribute("data-de-page-wrap-action")
            , r = a ? "de-is-expanded" : "de-is-open"
            , o = a ? "de-is-expanding" : "de-is-opening";
          if (null !== n && e && (window.innerWidth - document.documentElement.clientWidth != 0 && (document.scrollingElement.style.overflowY = "scroll"),
          i.forEach(function(t) {
              t.style.transform = "translateY(-" + s + "px)"
              
          })),
          c.forEach(function(t) {
              if ("true" !== t.getAttribute("data-de-page-wrap-always-shown")) {
                  var a = t.getAttribute(v)
                    , l = a === n
                    , d = document.getElementById(a);
                  d && (t.setAttribute("aria-expanded", l),
                  d.setAttribute("aria-hidden", !l),
                  l ? d.parentNode.classList.add(o) : d.parentNode.classList.remove(r),
                  setTimeout(function() {
                      n && l && d.parentNode.classList.add(r)
                  }, 0),
                  setTimeout(function() {
                      l && d.parentNode.classList.remove(o),
                      n || e && (document.scrollingElement.style.overflowY = "",
                      document.scrollingElement.scrollTop = s,
                      i.forEach(function(t) {
                          t.style.transform = ""
                      }))
                  }, 200))
              }
          }),
          a && n) {
              var l = document.getElementById(n);
              if (l) {
                  var d = l.querySelector('input[type="search"]');
                  d && d.focus()
              }
          }
      }
  }({
      targetEl: y
  })
}(jQuery);
