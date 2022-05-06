//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

contract TwitterContract {
    event AddTweet(address recipient, uint256 tweetId);
    event DeleteTweet(uint256 tweetId, bool isDeleted);

    struct Tweet {
        uint256 id;
        address username;
        string tweetText;
        bool isDeleted;
    }

    Tweet[] private tweets;

    // Mapping of tweet id to the wallet address of the user
    mapping(uint256 => address) tweetToOwner;

    // Method to be called by our frontend when adding a tweet
    function addTweet(string memory tweetText, bool isDeleted) external {
        uint256 tweetId = tweets.length;
        tweets.push(Tweet(tweetId, msg.sender, tweetText, isDeleted));
        tweetToOwner[tweetId] = msg.sender;
        emit AddTweet(msg.sender, tweetId);
    }

    // Method to get all tweets
    function getAllTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length);

        uint256 counter = 0;
        for (uint256 i = 0; i < tweets.length; i++) {
            if (tweets[i].isDeleted == false) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    // Method to get only my tweets
    function getMyTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length);

        uint256 counter = 0;
        for (uint256 i = 0; i < tweets.length; i++) {
            if (tweetToOwner[i] == msg.sender && tweets[i].isDeleted == false) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    // Method to delete a tweet
    function deleteTweet(uint256 tweetId, bool isDeleted) external {
        if (tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].isDeleted = isDeleted;
            emit DeleteTweet(tweetId, isDeleted);
        }
    }
}
