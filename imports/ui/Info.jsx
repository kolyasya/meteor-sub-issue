import React, { useEffect, memo } from 'react';
import { useFind, useSubscribe } from 'meteor/react-meteor-data/suspense';
import { LinksCollection } from '../api/links';

import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';

import { useQueryParam, StringParam } from 'use-query-params';

import { useMemoSubscribe } from './useMemoSubscribe';

const AnotherComponent = () => {
  const links = useFind(LinksCollection, [{}]);

  // console.log(links);

  const [randomParam, setRandomParam] = useQueryParam(
    'randomParam',
    StringParam
  );
  const [exprHash, setExprHash] = useQueryParam('exprHash', StringParam);

  useEffect(() => {
    // Shouldn't change sub
    const timer1 = setTimeout(() => {
      console.log(`don't re-sub`);
      setRandomParam('pampam');
    }, 1500);

    // Change sub
    const timer2 = setTimeout(() => {
      console.log(`re-sub`);
      setExprHash('hashhash');
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div>
      <h2>Learn Meteor!</h2>
      <Link to="/main">Go Main</Link>
      <ul>
        {links.map((link) => (
          <li key={link._id}>
            <a href={link.url} target="_blank">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Info = () => {
  const { docId } = useParams();

  const [randomParam] = useQueryParam('randomParam', StringParam);
  const [exprHash] = useQueryParam('exprHash', StringParam);

  /*   console.log(docId);
  console.log('render'); */

  useMemoSubscribe('links', { docId, exprHash });

  return <AnotherComponent />;
};
