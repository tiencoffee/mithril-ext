Object.assign(window.m, {
	cssUnitless: {
		animationIterationCount: true,
		borderImageOutset: true,
		borderImageSlice: true,
		borderImageWidth: true,
		boxFlex: true,
		boxFlexGroup: true,
		boxOrdinalGroup: true,
		columnCount: true,
		columns: true,
		flex: true,
		flexGrow: true,
		flexPositive: true,
		flexShrink: true,
		flexNegative: true,
		flexOrder: true,
		gridArea: true,
		gridRow: true,
		gridRowEnd: true,
		gridRowSpan: true,
		gridRowStart: true,
		gridColumn: true,
		gridColumnEnd: true,
		gridColumnSpan: true,
		gridColumnStart: true,
		fontWeight: true,
		lineClamp: true,
		lineHeight: true,
		opacity: true,
		order: true,
		orphans: true,
		tabSize: true,
		widows: true,
		zIndex: true,
		zoom: true,
		fillOpacity: true,
		floodOpacity: true,
		stopOpacity: true,
		strokeDasharray: true,
		strokeDashoffset: true,
		strokeMiterlimit: true,
		strokeOpacity: true,
		strokeWidth: true
	},

	class(...classes) {
		let res = []
		for (let cls of classes) {
			if (Array.isArray(cls)) {
				res.push(m.class(...cls))
			}
			else if (cls instanceof Object) {
				for (let k in cls) {
					if (cls[k]) {
						res.push(k)
					}
				}
			}
			else {
				res.push(cls)
			}
		}
		return res.join(' ')
	},

	style(...styles) {
		let res = {}
		for (let style of styles) {
			if (Array.isArray(style)) {
				style = m.style(...style)
			}
			if (style instanceof Object) {
				for (let k in style) {
					let val = style[k]
					res[k] = val
					if (!m.cssUnitless[k] && +val) {
						res[k] += 'px'
					}
				}
			}
		}
		return res
	},

	bind(obj, thisArg = obj, assignObj = obj) {
		for (let k in obj) {
			let val = obj[k]
			if (typeof val === 'function' && val.name !== 'bound ' && val.name !== 'class ') {
				assignObj[k] = val.bind(thisArg)
			}
		}
		return assignObj
	},

	async fetch(url, opts, type = 'text') {
		if (typeof opts === 'string') {
			[opts, type] = [, opts]
		}
		return (await fetch(url, opts))[type]()
	},

	comp(props, ...statics) {
		let comp = function() {
			let old = {}
			let vdom = {...props}
			Object.assign(vdom, {
				__oninit: vdom.oninit,
				__oncreate: vdom.oncreate,
				__onbeforeupdate: vdom.onbeforeupdate,
				__onupdate: vdom.onupdate,
				oninit(vnode) {
					this.attrs = vnode.attrs || {}
					this.children = vnode.children || []
					if (this.__oninit) {
						this.__oninit()
					}
					old = {
						attrs: {...this.attrs},
						children: [...this.children]
					}
					if (this.__onbeforeupdate) {
						this.__onbeforeupdate(old, true)
					}
				},
				oncreate(vnode) {
					this.dom = vnode.dom
					if (this.__oncreate) {
						this.__oncreate()
					}
					if (this.__onupdate) {
						this.__onupdate(true)
					}
				},
				onbeforeupdate(vnode) {
					this.attrs = vnode.attrs || {}
					this.children = vnode.children || []
					if (this.__onbeforeupdate) {
						this.__onbeforeupdate(old)
					}
				},
				onupdate(vnode) {
					this.dom = vnode.dom
					if (this.__onupdate) {
						this.__onupdate(true)
					}
					old = {
						attrs: {...this.attrs},
						children: [...this.children],
						dom: this.dom
					}
				}
			})
			return m.bind(vdom)
		}
		for (let stt of statics) {
			if (stt) {
				Object(stt, comp)
			}
		}
		return m.bind(comp)
	}
})
