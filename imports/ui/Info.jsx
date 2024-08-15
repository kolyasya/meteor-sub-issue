import React, { useEffect, memo } from 'react';
import { useFind, useSubscribe } from 'meteor/react-meteor-data/suspense';
import { LinksCollection } from '../api/links';

import { useParams } from 'react-router-dom';

import { useQueryParam, StringParam } from 'use-query-params';

const AnotherComponent = () => {
  const links = useFind(LinksCollection, [{}]);

  console.log(links);

  const [exprHash, setExprHash] = useQueryParam('exprHash', StringParam);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('set hash');
      setExprHash('');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h2>Learn Meteor!</h2>
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

  console.log(docId);
  console.log('render');

  useSubscribe('links', { docId });

  return <AnotherComponent />;
};
