import React, { Component } from 'react';

import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';

import * as S from './styles';
import Dialog from 'components/Dialog';
import keydown, { Keys } from 'react-keydown';
import { cycleValueAround } from 'utils';
import { includesLowercase } from 'utils/string-utils';

@observer
class PopupSelector extends Component {
  inputRef = React.createRef();
  itemsRef = React.createRef();

  @observable highlightedItem = null;
  @observable search = '';

  @computed
  get foundItems() {
    return this.props.items.filter(item => includesLowercase(item.name, this.search));
  }

  @action
  setHighlighted = id => {
    this.highlightedItem = id;
    if (this.inputRef && this.inputRef.current) {
      this.inputRef.current.focus();
    }
    const $element = document.getElementById(`item-${id}`);
    const $items = this.itemsRef.current;
    if (!($element && $items)) {
      return null;
    }

    const elementWithOffset = $element.offsetTop + $element.offsetHeight;
    const itemsWithOffset = $items.offsetHeight + $items.scrollTop;
    const isInView = elementWithOffset <= itemsWithOffset && $element.offsetTop >= $items.scrollTop;

    if (!isInView) {
      $items.scrollTop = elementWithOffset - $items.offsetHeight;
    }
  };

  @action
  setSearch = t => {
    this.search = t;
  };

  @keydown([Keys.up, Keys.down])
  onKeyOutside(e) {
    this.onkeyDown(e);
  }

  componentDidMount() {
    if (this.highlightedItem === null) {
      this.setHighlighted(this.props.items[0].id);
    }
  }

  onChange = e => {
    this.setSearch(e.target.value);
    let first = this.foundItems[0];
    this.setHighlighted(first ? first.id : null);
  };

  close = () => {
    this.props.onEsc && this.props.onEsc();
  };

  onkeyDown = e => {
    const { foundItems: items } = this;

    if (e.keyCode === Keys.enter) {
      const foundItem = items.find(i => i.id === this.highlightedItem);
      return this.choose(foundItem);
    }

    if (e.keyCode === Keys.esc) {
      return this.close();
    }

    if (e.keyCode === Keys.up || e.keyCode === Keys.down) {
      const index = items.findIndex(i => i.id === this.highlightedItem);
      let change = e.keyCode === Keys.up ? -1 : 1;
      const nextIndex = cycleValueAround(index, change, items.length);
      let nextItem = items[nextIndex];
      if (nextItem) {
        this.setHighlighted(nextItem.id);
      }
    }
  };

  choose = item => {
    const { onChoose, closeOnChoose } = this.props;
    onChoose && onChoose(item);
    if (closeOnChoose === true) {
      this.close();
    }
  };

  render() {
    const { key, inPortal, showSearch, renderItem, onEsc, overrides } = this.props;
    const { highlightedItem, foundItems: items } = overrides || this;

    return (
      <S.PopupSelector>
        <Dialog key={key} onClose={onEsc} onEsc={onEsc} autoHeight={true} inPortal={inPortal}>
          <S.Search>
            {showSearch && (
              <S.Input
                onChange={this.onChange}
                innerRef={this.inputRef}
                onKeyDown={this.onkeyDown}
                autoFocus
                placeholder="Search..."
              />
            )}
            <S.Items innerRef={this.itemsRef}>
              {items.map(item => (
                <S.Item
                  id={`item-${item.id}`}
                  isHighlighted={item.id === highlightedItem}
                  onDoubleClick={() => this.choose(item)}
                  onClick={() => this.setHighlighted(item.id)}
                  key={item.id}
                >
                  {renderItem ? renderItem(item) : item.name}
                </S.Item>
              ))}
            </S.Items>
          </S.Search>
        </Dialog>
      </S.PopupSelector>
    );
  }
}

export default PopupSelector;
