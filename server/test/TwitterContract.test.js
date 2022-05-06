const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TwitterContract", () => {
  let Twitter;
  let twitter;
  let owner;

  const NUM_TOTAL_NOT_MY_TWEETS = 5;
  const NUM_TOTAL_MY_TWEETS = 3;

  let totalTweets;
  let totalMyTweets;

  beforeEach(async () => {
    Twitter = await ethers.getContractFactory("TwitterContract");
    [owner, addr1, addr2] = await ethers.getSigners();
    twitter = await Twitter.deploy();

    totalTweets = [];
    totalMyTweets = [];

    for (let i = 0; i < NUM_TOTAL_NOT_MY_TWEETS; i++) {
      let tweet = {
        tweetText: "Random text with id: " + i,
        username: addr1,
        isDeleted: false,
      };

      await twitter.connect(addr1).addTweet(tweet.tweetText, tweet.isDeleted);
      totalTweets.push(tweet);
    }

    for (let i = 0; i < NUM_TOTAL_MY_TWEETS; i++) {
      let tweet = {
        username: owner,
        tweetText: "Random text with id: " + (NUM_TOTAL_NOT_MY_TWEETS + i),
        isDeleted: false,
      };

      await twitter.addTweet(tweet.tweetText, tweet.isDeleted);
      totalTweets.push(tweet);
      totalMyTweets.push(tweet);
    }
  });

  // Add twwet test
  describe("Add Tweet", () => {
    it("should emit AddTweet event", async () => {
      let tweet = {
        tweetText: "New Tweet",
        isDeleted: false,
      };

      await expect(await twitter.addTweet(tweet.tweetText, tweet.isDeleted))
        .to.emit(twitter, "AddTweet")
        .withArgs(owner.address, NUM_TOTAL_NOT_MY_TWEETS + NUM_TOTAL_MY_TWEETS);
    });
  });

  // Get all tweets test
  describe("Get all tweets", () => {
    it("should return the correct number of total tweets", async () => {
      const tweetsFromChain = await twitter.getAllTweets();
      expect(tweetsFromChain.length).to.equal(
        NUM_TOTAL_MY_TWEETS + NUM_TOTAL_NOT_MY_TWEETS
      );
    });

    it("should return the correct number of all my tweets", async () => {
      const myTweetsFromChain = await twitter.getMyTweets();
      expect(myTweetsFromChain.length).to.equal(NUM_TOTAL_MY_TWEETS);
    });
  });

  // Delete tweet test
  describe("Delete Tweet", () => {
    it("should emit delete tweet event", async () => {
      const TWEET_ID = 0;
      const TWEET_DELETED = true;

      await expect(twitter.connect(addr1).deleteTweet(TWEET_ID, TWEET_DELETED))
        .to.emit(twitter, "DeleteTweet")
        .withArgs(TWEET_ID, TWEET_DELETED);
    });
  });
});
