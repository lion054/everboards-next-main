import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { useContextualRouting } from 'next-use-contextual-routing';
import useSWR from 'swr';
import querystring from 'querystring';
import getQueryParam from 'get-query-param';

import { fetcher } from '../src/helpers/api';
import Link from '../src/Link';
import AssetList from '../src/AssetList';
import AssetDialog from '../src/AssetDialog';
import theme from '../src/helpers/theme';

const useStyles = makeStyles(theme => ({
  title: {
    color: '#fff',
    textShadow: `-1px -1px 0 ${colors.indigo[900]}, 1px -1px 0 ${colors.indigo[900]}, -1px 1px 0 ${colors.indigo[900]}, 1px 1px 0 ${colors.indigo[900]}`  ,
    fontFamily: 'NeueBit',
    fontWeight: '700'
  },
  social: {
    lineHeight: 1
  }
}));

export async function getServerSideProps(ctx) {
  const data = await fetcher(`${process.env.server}/api/assets`);
  const props = {
    data,
    error: !data
  };
  // const query = ctx.query || {};
  // const { contract_address, token_id } = query;
  // if (contract_address && token_id) {
  //   props.contract_address = contract_address;
  //   props.token_id = token_id;
  // }
  return { props };
}

const linkIconSize = theme.spacing(4.5);

function Assets(props) {
  const [activeAsset, setActiveAsset] = useState({});

  const classes = useStyles();
  const router = useRouter();
  const { makeContextualHref, returnHref } = useContextualRouting();

  const initialData = props.data;
  const { data, error } = useSWR('/api/assets', fetcher, { initialData });

  useEffect(() => {
    // browser's back or forward button
    window.addEventListener('popstate', (event) => {
      const contract_address = getQueryParam('contract_address', event.state.as);
      const token_id = getQueryParam('token_id', event.state.as);
      if (contract_address && token_id) {
        fetchAssetDetails(contract_address, token_id);
      } else {
        setActiveAsset({});
      }
    });
    // copy url when user opened the asset dialog and paste it to address bar
    const { contract_address, token_id } = router.query;
    if (contract_address && token_id) {
      fetchAssetDetails(contract_address, token_id);
    }
  }, []);

  const openModal = (contract_address, token_id) => {
    fetchAssetDetails(contract_address, token_id);
    const queryParams = querystring.stringify({
      contract_address,
      token_id
    });
    router.push(
      makeContextualHref({
        contract_address,
        token_id
      }),
      `/assets?${queryParams}`,
      { shallow: true }
    );
  }

  const closeModal = () => {
    // router.back();
    setActiveAsset({});
    router.push(
      '/assets',
      '/assets',
      { shallow: true }
    );
  }

  function fetchAssetDetails(contractAddress, tokenId) {
    fetch(`https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}`).then(res => {
      return res.json();
    }).then(json => {
      setActiveAsset(json);
    });
  }

  return (
    <Container maxWidth="sm">
      <style jsx global>{`
        #__next {
          background-color: ${colors.indigo[100]}
        }
      `}</style>
      <Box pt={4} pb={3}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          className={classes.title}
        >
          ELLIE PRITTS
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <Box
          width={theme.spacing(48)}
          height={theme.spacing(6.75)}
          px={4}
          mb={1.5}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          bgcolor="rgba(86, 86, 86, 0.65)"
          borderRadius={theme.spacing(1.25)}
        >
          <Link className={classes.social} href="https://www.instagram.com">
            <Image src="/images/instagram.png" alt="Instagram" width={linkIconSize} height={linkIconSize} />
          </Link>
          <Link className={classes.social} href="https://www.tiktok.com">
            <Image src="/images/tiktok.png" alt="TikTok" width={linkIconSize} height={linkIconSize} />
          </Link>
          <Link className={classes.social} href="https://www.twitter.com">
            <Image src="/images/twitter.png" alt="Twitter" width={linkIconSize} height={linkIconSize} />
          </Link>
          <Link className={classes.social} href="https://www.snapchat.com">
            <Image src="/images/snapchat.png" alt="Snapchat" width={linkIconSize} height={linkIconSize} />
          </Link>
          <Link className={classes.social} href="https://www.vimeo.com">
            <Image src="/images/vimeo.png" alt="Vimeo" width={linkIconSize} height={linkIconSize} />
          </Link>
          <Link className={classes.social} href="https://www.youtube.com">
            <Image src="/images/youtube.png" alt="Youtube" width={linkIconSize} height={linkIconSize} />
          </Link>
          <Link className={classes.social} href="https://www.twitch.com">
            <Image src="/images/twitch.png" alt="Twitch" width={linkIconSize} height={linkIconSize} />
          </Link>
          <Link className={classes.social} href="https://www.linkedin.com">
            <Image src="/images/linkedin.png" alt="LinkedIn" width={linkIconSize} height={linkIconSize} />
          </Link>
        </Box>
      </Box>
      <Box pb={4}>
        <AssetList
          data={data}
          error={error}
          onItemClicked={openModal}
        />
      </Box>
      <AssetDialog
        data={activeAsset}
        onClose={closeModal}
      />
    </Container>
  );
}

export default Assets;
