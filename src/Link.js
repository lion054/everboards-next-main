import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Link as MuiLink } from '@material-ui/core';

export const NextLinkComposed = forwardRef((props, ref) => {
  const { to, linkAs, href, replace, scroll, passHref, shallow, prefetch, locale, ...rest } = props;
  return (
    <NextLink
      href={to}
      prefetch={prefetch}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      locale={locale}
    >
      <a ref={ref} {...rest} />
    </NextLink>
  );
});

NextLinkComposed.propTypes = {
  href: PropTypes.any,
  linkAs: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  locale: PropTypes.string,
  passHref: PropTypes.string,
  prefetch: PropTypes.bool,
  replace: PropTypes.bool,
  scroll: PropTypes.bool,
  shallow: PropTypes.bool,
  to: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]).isRequired
};

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
const Link = forwardRef((props, ref) => {
  const {
    activeClassName = 'active',
    as: linkAs,
    className: classNameProps,
    href,
    noLinkStyle,
    role, // Link doesn't have roles
    ...rest
  } = props;

  const router = useRouter();
  const pathname = typeof href === 'string' ? href : href.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName
  });
  const isExternal = typeof href === 'string' && (href.startsWith('http') || href.startsWith('mailto:'));

  if (isExternal) {
    if (noLinkStyle) {
      return <a className={className} href={href} ref={ref} {...rest} />;
    }
    return <MuiLink className={className} href={href} ref={ref} {...rest} />;
  }

  if (noLinkStyle) {
    return <NextLinkComposed className={className} ref={ref} {...rest} to={href} />;
  }

  return (
    <MuiLink
      component={NextLinkComposed}
      linkAs={linkAs}
      className={className}
      ref={ref}
      to={href}
      {...rest}
    />
  );
});

Link.propTypes = {
  activeClassName: PropTypes.string,
  as: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  className: PropTypes.string,
  href: PropTypes.any,
  noLinkStyle: PropTypes.bool,
  role: PropTypes.string
};

export default Link;
