import React from "react";
import {Action, Store, Context} from "material-flux";
//Application Const
const MENU = {
    Pasta: 0,
    Salada: 1
}

class MenuStore extends Store{
    constructor(context){
      super(context);
      this.register("handleMenu", this.onMenuHandler);
      this.state = {
          menuStatus : MENU.Pasta
      }
    }
    onMenuHandler(menuStatus){
      this.setState({
        menuStatus : menuStatus
      });
    }
    getMenuStatus(){
      return this.state.menuStatus;
    }
}


class MenuAction extends Action{
    handleMenu(state){
        this.dispatch("handleMenu", state);
    }
}

class MenuContext extends Context{
    constructor(){
      super();
      this.menuAction = new MenuAction(this);
      this.menuStore = new MenuStore(this);
    }
}
//Header
var Header = React.createClass({
    handleClick: function(event) {
        var selected = event.target.getAttribute("data-value");
        var { context } = this.props;
        context.menuAction.handleMenu(selected);
    },
    render: function() {
        var self = this;
        var selected = this.props.menu;
        var menus = Object.keys(MENU).map(function(m){
            return {name:m, value:MENU[m], className: (MENU[m] == selected ? "menu active" : "menu")}
        });
        var nodes = menus.map(function(m){
            return <div data-value={m.value} className={m.className} onClick={self.handleClick}>{m.name}</div>;
        });
        return <div>{nodes}</div>;
    }
});

//Content
var Content = React.createClass({
    render: function() {
        var list = [];
        if(this.props.menu == MENU.Pasta){
            list = ["Carbonara", "Peperoncino", "Mentaiko"]
        }else{
            list = ["Green Salada", "Caesar salad"]
        }
        return <ul>{list.map(function(e, i){ return <li key={i}>{e}</li>; })}</ul>;
    }
});

//Pager
var Pager = React.createClass({
    handleClick: function(event) {
        var next = (this.props.menu == MENU.Pasta ? MENU.Salada : MENU.Pasta);
        var { context } = this.props;
        context.menuAction.handleMenu(next);
    },
    render: function() {
        var arrow = (this.props.menu == MENU.Pasta ? ">>" : "<<");
        return <button onClick={this.handleClick}>{arrow}</button>;
    }
})



var menuContext = new MenuContext()
var header = React.render(<Header context={menuContext}/>, document.getElementById("header"));
var content = React.render(<Content context={menuContext}/>, document.getElementById("content"));
var pager = React.render(<Pager context={menuContext}/>, document.getElementById("pager"));
function updateMenu(menu){
    [header, content, pager].forEach(function(component){
      component.setProps({menu : menu});
    });
}
menuContext.menuStore.onChange(function(){
    updateMenu(menuContext.menuStore.getMenuStatus());
});
// initialize
updateMenu(menuContext.menuStore.getMenuStatus());
