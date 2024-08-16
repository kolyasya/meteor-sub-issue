import { useEffect } from 'react';
import type { EJSON } from 'meteor/ejson';
import { Meteor } from 'meteor/meteor';

import isEqual from 'lodash.isequal';
import remove from 'lodash.remove';

const cachedSubscriptions: Entry[] = [];

const getCachedSubscription = (name: string, params: EJSON[]) => {
  return cachedSubscriptions.find(
    (x) => x.name === name && isEqual(x.params, params)
  );
};

interface Entry {
  params: EJSON[];
  name: string;
  handle?: Meteor.SubscriptionHandle;
  promise: Promise<Meteor.SubscriptionHandle>;
  result?: null;
  error?: unknown;
}

const logging = true;

export const useMemoSubscribe = (name: string, ...params: EJSON[]) => {
  const unsubscribe = () => {
    logging && console.log(`useMemoSubscribe | ${name}: unsubscribe`, params);

    const cachedSubscription = getCachedSubscription(name, params);

    if (cachedSubscription) {
      cachedSubscription.handle?.stop();
      remove(
        cachedSubscriptions,
        (x) =>
          x.name === cachedSubscription.name &&
          isEqual(x.params, cachedSubscription.params)
      );
    }
  };

  useEffect(() => {
    const cachedSubscription = getCachedSubscription(name, params);

    if (cachedSubscription) {
      unsubscribe();
    }

    const subscription: Entry = {
      name,
      params,
      promise: new Promise<Meteor.SubscriptionHandle>((resolve, reject) => {
        logging && console.log(`useMemoSubscribe | ${name}: subscribe`);
        const h = Meteor.subscribe(name, ...params, {
          onReady() {
            subscription.result = null;
            subscription.handle = h;
            resolve(h);
          },
          onStop(error: unknown) {
            subscription.error = error;
            subscription.handle = h;
            reject(error);
          },
        });
      }),
    };

    cachedSubscriptions.push(subscription);

    return () => {
      unsubscribe();
    };
  }, [JSON.stringify(params)]);

  const cachedSubscription = getCachedSubscription(name, params);

  if (cachedSubscription) {
    if ('error' in cachedSubscription) throw cachedSubscription.error;
    if ('result' in cachedSubscription) return cachedSubscription.result;
    throw cachedSubscription.promise;
  }
};
