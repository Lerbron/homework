class VNode {
  constructor(tag, attr, children, parent, childrenTemplate) {
    this.tag = tag;
    this.attr = attr;
    this.children = children;
    this.parent = parent;
    this.childrenTemplate = childrenTemplate;
    this.uuid = this.getUuid();
  }
  getUuid() {
    return (
      Math.random() * 10000000000 +
      Math.random() * 100000 +
      Date.now()
    ).toString(36);
  }
}

class Engine {
  constructor() {
    this.nodes = new Map();
  }

  render = (tmpl, data) => {
    const rootNode = this.setNodes(tmpl);
    return this.parseNodeToDom(rootNode, data);
  }

  setNodes = (tmpl) => {
    const re1 = /<(\w+)\s*([^>]*)>([^<]*)<\/\1>/gm; // 双标签
    const re2 = /<(\w+)\s*([^(/>)]*)\/>/gm; // 单标签

    let template = tmpl.replace(/\n/gm, "");

    // 从模版中的直接子元素逐级向下匹配
    while (re1.test(template) || re2.test(template)) {
      console.log('template-->', template)
      template = template.replace(re1, (s0, s1, s2, s3) => {
        /*
          s1  标签名
          s2  标签上的属性
          s3  子元素

          <div class="newslist">
            <div class="img">
              {{info.name}}
            </div>
          </div>
          ------->
          <div class="newslist">
            (krh9c5x2.mfs)
          </div>
        */
        let attr = this.parseAttribute(s2);
        let node = new VNode(s1, attr, [], null, s3);
        this.nodes.set(node.uuid, node);
        return `(${node.uuid})`; // 将uuid与node对应后，返回特定格式的字符 如 (krh9c5x2.mfs) 
      });
      template = template.replace(re2, (s0, s1, s2) => {
        let attr = this.parseAttribute(s2);
        let node = new VNode(s1, attr, [], null, "");
        this.nodes.set(node.uuid, node);
        return `(${node.uuid})`;
      });
    }
    //最终的template： <div class="newslist">        (ksqncc35.plp)        (ktnz3sq0.38g)        (ks7w7p6n.sjd)    </div>
    return this.parseToNode(template);
  };

  parseToNode(template) {
    let re = /\((.*?)\)/g;
    let stack = [];
    let parent = new VNode("root", {}, [], null, template, null);
    stack.push(parent);
    //转成成node节点
    while (stack.length > 0) {
      let pNode = stack.pop();
      let nodeStr = pNode.childrenTemplate.trim();
      re.lastIndex = 0;
      [...nodeStr.matchAll(re)].forEach((item) => {
        // 取出每个uuid对应的node
        let n = this.nodes.get(item[1]);
        let newNode = new VNode(
          n.tag,
          n.attr,
          [],
          pNode,
          n.childrenTemplate,
          null
        );
        // 从头部插入，保证parseNodeToDom对子元素先遍历push后pop的操作，保证子元素的顺序一致
        pNode.children.unshift(newNode);
        stack.push(newNode);
      });
    }
    return parent.children[0];
  }

  parseNodeToDom(root, data) {
    let fragment = document.createDocumentFragment();
    let stack = [
      [root, fragment, data]
    ];
    //转成成node节点
    while (stack.length > 0) {
      let [pNode, pDom, scope] = stack.pop();
      // 处理元素中是否有 v-if 属性，如果对应的boolea值为false则不进行dom元素创建
      if (pNode.attr.get("v-if")) {
        let [key, prop] = pNode.attr.get("v-if").split(".");
        key = key.trim();
        prop = prop.trim();
        const isRender = scope[key][prop];
        if (!isRender) {
          continue;
        }
      }

      const html = this.scopeHtmlParse(pNode, data, scope);
      const ele = this.createElement(pNode, html);
      this.scopeAttrParse(ele, pNode, data, scope);
      pDom.appendChild(ele);

      for (let i = 0; i < pNode.children?.length; i++) {
        stack.push([pNode.children[i], ele, scope]);
      }
    }
    return fragment;
  }

  scopeHtmlParse(node, globalScope, currentScope) {
    // 解析标签中子元素包含 {{...}} 模版，并获取对应的值
    return node.childrenTemplate.replace(/{{(.*?)}}/g, (s0, s1) => {
      let props = s1.split(".");
      let val = currentScope[props[0]] || globalScope[props[0]];
      props.slice(1).forEach((item) => {
        val = val[item];
      });
      return val;
    });
  }

  scopeAttrParse(ele, node, globalScope, currentScope) {
    // 获取模版中元素节点上 包含 {{...}}的属性 如 {{image}}，并解析相应的值，设置为改元素的属性值
    for (let [key, value] of node.attr) {
      let result = /{{(.*?)}}/.exec(value);
      if (result && result.length > 0) {
        let props = result[1].split(".");
        let val = currentScope[props[0]] || globalScope[props[0]];
        props.slice(1).forEach((item) => {
          val = val[item];
        });
        ele.setAttribute(key, val);
      }
    }
  }

  createElement(node, html) {
    let ignoreAttr = ["v-if"];
    let dom = document.createElement(node.tag);
    for (let [key, val] of node.attr) {
      if (!ignoreAttr.includes(key)) {
        dom.setAttribute(key, val);
      }
    }
    if (node.children.length === 0) {
      dom.innerHTML = html;
    }
    return dom;
  }

  parseAttribute(str) {
    let attr = new Map();
    str = str.trim();
    // 处理属性 class="img" v-if="info.showImage"  将 = 两边的属性名和属性值匹配出来，存在Map中
    str.replace(/([\w|-]+)\s*=['"](.*?)['"]/gm, (s0, s1, s2) => {
      attr.set(s1, s2);
      return s0;
    });
    return attr;
  }

}

const render = (tmpl, data = {}, selector = '') => {
  const engine = new Engine();
  return engine.render(tmpl, data);
};

const tmpl = `
    <div class="newslist">
        <div class="img" v-if="info.showImage">
            <img src="{{image}}" />
        </div>
        <div class="date" v-if="info.showDate">
            {{info.name}}
        </div>
        <div class="img">
            {{info.name}}
        </div>
    </div>
`;

const data = {
  image: "https://p.ssl.qhimg.com/sdm/365_207_/t01052a7ef57d7bb3c5.jpg",
  info: {
    showImage: true,
    showDate: true,
    name: "aaa"
  }
};

const dom = render(tmpl, data);
document.querySelector('#root').appendChild(dom)