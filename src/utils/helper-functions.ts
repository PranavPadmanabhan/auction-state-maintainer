import mongoose from "mongoose";
import Rooms from "../models/room";
import Users from "../models/user";



// Apply the middleware to all routes


export const ListenAuctions = async () => {
if(mongoose.ConnectionStates.connected){
  try {
    Rooms.find({}).maxTimeMS(20000).then(async (rooms) => {
      console.log('total rooms : ', rooms.length)
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].startingTime < Date.now() && rooms[i].endingTime > Date.now()) {
          const isEligible = rooms[i].timestamp! - Date.now() >= 25000 || Date.now() - rooms[i].timestamp! >= 25000;
          console.log('eligibility - ', isEligible);
          if (isEligible) {
            const nextIndex = rooms[i].activeBidderIndex! < rooms[i].participants.length - 1 ? rooms[i].activeBidderIndex! + 1 : 0;
            const nextParticipant = rooms[i].participants[nextIndex].userId;
            rooms[i].activeBidderIndex = nextIndex;
            rooms[i].activeBidder = nextParticipant;
            rooms[i].timestamp = Date.now();
            await rooms[i].save();
            console.log("next user index : ", nextIndex);
          }
  
        }
        else {
          if (rooms[i].endingTime < Date.now()) {
            const sorted = rooms[i].biddersList.sort((a,b) => {
              if(a.bidAmount < b.bidAmount){
                return 1
              }
              else {
                return -1
              }
            })
            const user = await Users.findOne({ userId: sorted[0].userId })
            const owner = await Users.findOne({ userId : rooms[i].admin })
            if(user && owner){
              user.cart = [...user.cart,{
                productDetails:rooms[i].productDetails,
                price:sorted[0].bidAmount,
                owner
              }]
              await user.save()
            }
            await Rooms.findByIdAndDelete(rooms[i]._id)
            console.log('deleted')
          }
  
        }
      }
    })
  } catch (error) {
    
  }
}

  setTimeout(() => {
    ListenAuctions()
  }, 5000);
}