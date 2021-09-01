/* eslint-disable react-hooks/exhaustive-deps */
import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useState } from 'react';
import PlantsFeedPresenter from './PlantsFeedPresenter';

const PLANTS_FEED_QUERY = gql`
  query seeWholePlantsFeed($offset: Int) {
    seeWholePlantsFeed(offset: $offset) {
      id
      title
      caption
      water
      sunlight
      temperatureMin
      temperatureMax
      plantDivision
      plantClass
      plantOrder
      plantFamily
      plantGenus
      plantSpecies
      plantHome
      plantHabitat
      plantLikes
      isLiked
      user {
        username
        avatar
      }
      images {
        file
      }
    }
  }
`;

const PlantsFeedContainer = () => {
  const { data: plantsData, loading, fetchMore } = useQuery(PLANTS_FEED_QUERY);
  const [hasMore, setHasMore] = useState(true);
  const [update, setUpdate] = useState(false);

  const onLoadMore = async () => {
    setUpdate(true);
    await fetchMore({
      variables: {
        offset: plantsData?.seeWholePlantsFeed?.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (fetchMoreResult.seeWholePlantsFeed.length) {
          setHasMore(true);
        } else {
          setHasMore(false);
          setUpdate(false);
        }
        if (!fetchMoreResult) {
          return prev;
        } else {
          return Object.assign({}, prev, {
            seeWholePlantsFeed: [
              ...prev.seeWholePlantsFeed,
              ...fetchMoreResult.seeWholePlantsFeed,
            ],
          });
        }
      },
    });
  };

  // useEffect(() => {
  //   refetch();
  //   return () => {
  //     refetch();
  //   };
  // }, [refetch]);

  return (
    <PlantsFeedPresenter
      plantsData={plantsData}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      loading={loading}
      update={update}
    />
  );
};

export default PlantsFeedContainer;
