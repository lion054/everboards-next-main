import React, { forwardRef, useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  makeStyles,
  withStyles
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import NextImage from 'next/image';
import MuiImage from 'material-ui-image';
import NextLink from 'next/link';
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from 'react-sortable-hoc';
import { IoEye } from 'react-icons/io5';
import arrayMove from 'array-move';
import PropTypes from 'prop-types';

import theme from '../src/helpers/theme';

const useStyles = makeStyles(theme => ({
  loading: {
    height: theme.spacing(5),
    textAlign: 'center'
  },
  thumb: {
    backgroundColor: '#fff',
    padding: theme.spacing(1),
    [theme.breakpoints.only('xs')]: {
      padding: theme.spacing(0.5)
    }
  }
}));

function getAssetImage({ image_original_url, image_preview_url, image_thumbnail_url, image_url }) {
  // avoid null src, so that MuiImage cannot fail
  return image_original_url || image_preview_url || image_thumbnail_url || image_url || '/images/placeholder.png';
}

const StyledHandle = withStyles(theme => ({
  root: {
    position: 'absolute',
    top: theme.spacing(2.5),
    right: theme.spacing(2.5),
    width: theme.spacing(5),
    height: theme.spacing(5),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    borderRadius: theme.spacing(0.75),
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  }
}))(Box);

const DragHandle = SortableHandle(({ value, onClicked }) => (
  <StyledHandle className="asset-handle">
    <NextLink
      className="asset-handle"
      href={`/assets?contract_address=${value.asset_contract.address}&token_id=${value.token_id}`}
    >
      <a
        className="asset-handle"
        onClick={() => onClicked(value.asset_contract.address, value.token_id)}
      >
        <IoEye className="asset-handle" size={theme.spacing(4)} style={{
          marginTop: theme.spacing(0.5),
          pointerEvents: 'none'
        }} />
      </a>
    </NextLink>
  </StyledHandle>
))

const StyledTile = withStyles(theme => ({
  root: {
    float: 'left',
    display: 'inline',
    width: '50%',
    padding: theme.spacing(1),
    [theme.breakpoints.only('sm')]: {
      padding: theme.spacing(0.5)
    },
    position: 'relative',
    cursor: 'grab'
  }
}))(Box);

const SortableItem = SortableElement(({ value, onClicked }) => {
  const classes = useStyles();

  return (
    <StyledTile>
      <MuiImage
        src={getAssetImage(value)}
        errorIcon={( // finish loading if no image exists in url
          <NextImage
            src="/images/placeholder.png"
            alt=""
            width="100%"
            height="100%"
          />
        )}
        className={classes.thumb}
      />
      <DragHandle value={value} onClicked={onClicked} />
    </StyledTile>
  );
})

const StyledContainer = withStyles({
  root: {
    display: 'flow-root'
  }
})(Box);

const SortableGrid = SortableContainer(({ items, onItemClicked }) => (
  <StyledContainer>
    {items.map((item, index) => (
      <SortableItem
        key={`item-${item.id}`}
        index={index} // required
        value={item}
        onClicked={onItemClicked}
      />
    ))}
  </StyledContainer>
))

const AssetList = forwardRef((props, ref) => {
  const [items, setItems] = useState();
  const classes = useStyles();

  useEffect(() => {
    setItems(props.data ? props.data.assets : null);
  }, [props.data]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(items => arrayMove(items, oldIndex, newIndex));
  }

  return props.error ? (
    <Alert severity="error">Failed to load data</Alert>
  ) : !items ? (
    <Box className={classes.loading}>
      <CircularProgress />
    </Box>
  ) : (
    <SortableGrid
      axis="xy"
      items={items}
      onSortEnd={onSortEnd}
      onItemClicked={props.onItemClicked}
      shouldCancelStart={event => {
        // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
        // So that user can drag & drop asset
        if (event.target.classList.contains('asset-handle')) {
          return true;
        }
      }}
    />
  );
})

AssetList.propTypes = {
  data: PropTypes.object.isRequired,
  error: PropTypes.bool,
  onItemClicked: PropTypes.func.isRequired
};

export default AssetList;
