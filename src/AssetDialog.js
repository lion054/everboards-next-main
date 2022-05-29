import React, { forwardRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  IconButton,
  makeStyles,
  withStyles
} from '@material-ui/core';
import { IoCloseCircle, IoPlaySharp } from 'react-icons/io5';
import { isEmpty } from 'lodash/fp';
import PropTypes from 'prop-types';

import theme from '../src/helpers/theme';

const useStyles = makeStyles(theme => ({
  backdrop: {
    backdropFilter: 'blur(6px)',
    backgroundColor: 'rgba(0, 0, 30, 0.4)'
  },
  card: {
    position: 'relative'
  },
  header: {
    width: theme.spacing(39.5),
    color: '#464646',
    fontFamily: 'SF Pro Display',
    fontWeight: '300',
    fontSize: theme.spacing(2.25),
    lineHeight: theme.spacing(2.625) + 'px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    position: 'relative'
  },
  formLabel: {
    width: theme.spacing(9),
    color: '#464646',
    fontFamily: 'SF Pro Display',
    fontWeight: '300',
    fontSize: theme.spacing(1.75),
    lineHeight: theme.spacing(2.25) + 'px'
  },
  userAvatar: {
    borderRadius: theme.spacing(2)
  },
  username: {
    marginLeft: theme.spacing(1),
    color: '#5A5A5A',
    fontFamily: 'SF Pro Display',
    fontWeight: '500',
    fontSize: theme.spacing(1.75),
    lineHeight: 1.33
  }
}));

const StyledButton = withStyles(theme => ({
  root: {
    width: '100%',
    borderRadius: theme.spacing(1.25),
    backgroundColor: '#464646',
    color: '#fff',
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    fontFamily: 'SF Pro Display',
    fontSize: theme.spacing(2.25),
    lineHeight: theme.spacing(3) + 'px'
  }
}))(Button);

function getAssetImage({ image_original_url, image_preview_url, image_thumbnail_url, image_url }) {
  // avoid null src, so that MuiImage cannot fail
  return image_original_url || image_preview_url || image_thumbnail_url || image_url || '/images/placeholder.png';
}

function getCreatorImage({ creator }) {
  // avoid null src, so that MuiImage cannot fail
  if (creator) {
    if (creator.profile_img_url) {
      return creator.profile_img_url;
    }
  }
  return '/images/placeholder.png';
}

function getOwnerImage({ owner }) {
  // avoid null src, so that MuiImage cannot fail
  if (owner) {
    if (owner.profile_img_url) {
      return owner.profile_img_url;
    }
  }
  return '/images/placeholder.png';
}

function getUserName(asset) {
  if (asset) {
    if (asset.user) {
      if (!!asset.user.username) {
        return '@' + asset.user.username;
      }
    }
  }
  return '';
}

const AssetDialog = forwardRef((props, ref) => {
  const { data, onClose } = props;
  const classes = useStyles();

  return (
    <Dialog
      BackdropProps={{
        className: classes.backdrop
      }}
      open={!isEmpty(data)}
      onBackdropClick={onClose}
      maxWidth="xs"
    >
      <Card className={classes.card}>
        <CardHeader
          avatar={(
            <IoCloseCircle color="#F46B5D" size={theme.spacing(2.5)} onClick={onClose} />
          )}
          title={data.name}
          titleTypographyProps={{
            className: classes.header
          }}
        />
        <CardMedia
          className={classes.media}
          image={getAssetImage(data)}
        >
          <Box position="absolute" top={0} right={0} bottom={0} left={0} display="flex" justifyContent="center" alignItems="center">
            <IconButton>
              <IoPlaySharp size={theme.spacing(20)} color="#E9E9E9" opacity={0.65} />
            </IconButton>
          </Box>
        </CardMedia>
        <CardContent>
          <Box
            color="#5A5A5A"
            fontFamily="SF Pro Display"
            fontWeight="300"
            fontSize={theme.spacing(1.75)}
            lineHeight={theme.spacing(2.125) + 'px'}
            pb={2}
          >
            {data.description}
          </Box>
          {!isEmpty(data) && (
            <Box display="flex" alignItems="center" pb={1}>
              <Box className={classes.formLabel}>Created by:</Box>
              <Avatar src={getCreatorImage(data)} />
              <Box className={classes.username}>{getUserName(data.creator)}</Box>
            </Box>
          )}
          {!isEmpty(data) && (
            <Box display="flex" alignItems="center">
              <Box className={classes.formLabel}>Owned by:</Box>
              <Avatar src={getOwnerImage(data)} />
              <Box className={classes.username}>{getUserName(data.owner)}</Box>
            </Box>
          )}
        </CardContent>
        <CardActions>
          <StyledButton variant="contained">
            <Box fontWeight="300">Bid on</Box>
            &nbsp;
            <Box fontWeight="500">Foundation</Box>
          </StyledButton>
        </CardActions>
      </Card>
    </Dialog>
  );
})

AssetDialog.propTypes = {
  data: PropTypes.object.isRequired,
  error: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export default AssetDialog;
