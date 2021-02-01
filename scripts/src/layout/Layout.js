import Split from 'split.js';
import * as layout from './layoutState';
import store from '../reducers';

export const horizontalSplits = Split(['#sidebar-container','#content','#curriculum-container'], {
    gutterSize: 6,
    minSize: layout.horizontalMinSize,
    snapOffset: 0,
    sizes: layout.selectHorizontalRatio(store.getState()),
    gutter(index, direction) {
        const gutter = document.createElement('div');
        gutter.className = `gutter gutter-${direction}`;
        gutter.id = `gutter-${direction}-${index-1}`; // Given index starts at 1.
        return gutter;
    },
    gutterStyle() {
        return {
            width: '6px',
            cursor: 'ew-resize',
            'z-index': 100
        }
    },
    onDragEnd(ratio) {
        store.dispatch(layout.setHorizontalSizesFromRatio(ratio));
    }
});

export const resetHorizontalSplits = () => {
    horizontalSplits.setSizes(layout.selectHorizontalRatio(store.getState()));
};

export const toggleHorizontalDrag = (index, state) => {
    document.getElementById(`gutter-horizontal-${index}`).style['pointer-events'] = state ? 'auto' : 'none';
};

export const verticalSplits = Split(['#devctrl','#coder','#console-frame'], {
    direction: 'vertical',
    gutterSize: 6,
    minSize: 50,
    sizes: layout.selectVerticalRatio(store.getState()),
    snapOffset: 0,
    elementStyle(dimension, size, gutterSize) {
        return {
            'flex-basis': `calc(${size}% - ${gutterSize}px)`,
        }
    },
    gutterStyle(dimension, gutterSize) {
        return {
            'flex-basis': gutterSize + 'px',
            height: '6px',
            cursor: 'ns-resize',
            'z-index': 100
        }
    },
    onDragEnd(ratio) {
        store.dispatch(layout.setVerticalSizesFromRatio(ratio));
    }
});

// Initialize the draggability for the horizontal gutters.
!layout.isWestOpen(store.getState()) && toggleHorizontalDrag(0, false);
!layout.isEastOpen(store.getState()) && toggleHorizontalDrag(1, false);