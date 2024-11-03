import axios from "axios";

const BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
    const userId = ""
    test("User is able to sign up only once", async () => {
        const username = "Abstergo" + Math.random();
        const password = "123456";
        
        const response = await axios.post(`${BACKEND_URL}/api/user/signup`, {
            username,
            password,
            type:"admin"
        });
        userId = response.data.userId
        expect(response.status).toBe(200);

        const updatedResponse = await axios.post(`${BACKEND_URL}/api/user/signup`,{
            username,
            password
        })
        expect(updatedResponse.status).toBe(400)
    });
    test("Request fails if username is empty", async ()=>{
        const username =""
        const password = "123456"

        const response = await axios.post(`${BACKEND_URL}/api/user/signup`,{
            username,
            password,
            type:"admin"

        })

        expect(response.status).toBe(400)
    })

    test("Signin succeeds with correct username and password",async ()=>{
        const username = "Abstergo "+Math.random();
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/user/signup`,{
            username,
            password,
            type:"admin"

        })
        const response =await axios.post(`${BACKEND_URL}/api/user/signin`,{
            username,
            password
        })
        expect(response.status).toBe(200)
        expect(response.body.token).toBeDefined();

        
    })
    test("Signin succeeds with correct username and password",async ()=>{
        const username = "Abstergo "+Math.random();
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/user/signup`,{
            username,
            password,
            type:"admin"

        })
        const response =await axios.post(`${BACKEND_URL}/api/user/signin`,{
            username:"Dummy",
            password:"1234567"
        })
        expect(response.status).toBe(403)
        expect(response.body.token).not.toBeDefined();

        
    })

});



describe("User information page",()=>{

    let token = ""
    let avatarId = ""

    beforeAll(async ()=>{

    const username = "Abstergo"+Math.random();
    const password = "123456"

    await axios.post(`${BACKEND_URL}/api/user/signup`,{
        username,
        password,
        type:"admin"

    })
    const response = await axios.post(`${BACKEND_URL}/api/user/signin`,{
        username,
        password
    })
    token = response.body.token

    const avatarResponse = await axios.post(`${BACKEND_URL}/api/admin/createAvatar`,{
        imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name:"Timmy"
    })

    avatarId = avatarResponse.data.avatarId
    })

    test("User cant update metadata due to wrong AvatarId",async ()=>{
        const resposne = await axios.post(`${BACKEND_URL}/api/user/metadata`,{
            avatarId:"12353412"
        },{
            headers:{
                authorization:`Bearer ${token}`
            }
        })

        expect(resposne.status).toBe(400)
    })
    test("User can update metadata due to right AvatarId",async ()=>{
        const resposne = await axios.post(`${BACKEND_URL}/api/user/metadata`,{
            avatarId
        },{
            headers:{
                authorization:`Bearer ${token}`
            }
        })

        expect(resposne.status).toBe(200)
    })
    test("User cant update metadata due to no authorization header",async ()=>{
        const resposne = await axios.post(`${BACKEND_URL}/api/user/metadata`,{
            avatarId
        })

        expect(resposne.status).toBe(403)
    })

})

describe("User Avatar Info",()=>{
    let token = ""
    let avatarId = ""
    let userId = ""

    beforeAll(async ()=>{

    const username = "Abstergo"+Math.random();
    const password = "123456"

    const signUpResponse = await axios.post(`${BACKEND_URL}/api/user/signup`,{
        username,
        password,
        type:"admin"

    })

    userId = signUpResponse.data.userId

    const response = await axios.post(`${BACKEND_URL}/api/user/signin`,{
        username,
        password
    })
    token = response.body.token

    const avatarResponse = await axios.post(`${BACKEND_URL}/api/admin/createAvatar`,{
        imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name:"Timmy"
    })

    avatarId = avatarResponse.data.avatarId
    })


    test("Get back user's avatar information",async () =>{

        const response = await axios.get(`${BACKEND_URL}/api/user/metadata/bulk?ids=[${userId}]`)

        expect(response.data.avatars.length).toBe(1)
    })

    test("List all the available avatars",async ()=>{

        const response = await axios.get(`${BACKEND_URL}/api/avatars`)

        expect(response.data.avatars.length).not.toBe(0)

        const currentAvatar = response.data.avatars.find(x=> x.id == avatarId)

        expect(currentAvatar).toBeDefined();
    })

})



describe("Space information",()=>{
    let mapId;
    let element1Id;
    let element2Id;
    let adminToken;
    let adminId;
    let userToken;
    let userId;


    beforeAll(async ()=>{

    const username = "Abstergo"+Math.random();
    const password = "123456"

    const adminResponse = await axios.post(`${BACKEND_URL}/api/user/signup`,{ 
        username,
        password,
        type:"admin"

    })

    adminId = adminResponse.data.id


    const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/user/signin`,{
        username,
        password
    })
    adminToken = adminSigninResponse.body.token

    const signUpResponse = await axios.post(`${BACKEND_URL}/api/user/signup`,{ 
        username,
        password,

    })

    userId = signUpResponse.data.id


    const response = await axios.post(`${BACKEND_URL}/api/user/signin`,{
        username,
        password
    })
    userToken = response.body.token

        const element1 = await axios.post(`${BACKEND_URL}/api/admin/element`,{
        "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        "width": 1,
        "height": 1,
    },{
        headers:{
            authorization:`Bearer ${adminToken}`
        }
    })
    const element2 = await axios.post(`${BACKEND_URL}/api/admin/element`,{
        "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        "width": 1,
        "height": 1,
    },{
        headers:{
            authorization:`Bearer ${adminToken}`
        }
    })
    element1Id = element1.id
    element2Id = element2.id


    const map = await axios.post(`${BACKEND_URL}/api/admin/map`,{
        "thumbnail": "https://thumbnail.com/a.png",
        "dimensions": "100x200",
        "name": "100 person interview room",
        "defaultElements": [{
                elementId: element1Id,
                x: 20,
                y: 20
            }, {
              elementId: element1Id,
                x: 18,
                y: 20
            }, {
              elementId: element2Id,
                x: 19,
                y: 20
            }
        ]
     },{
        headers:{
            authorization:`Bearer ${adminToken}`
        }
    })

    mapId = map.id
})


    test("User creates a space",async ()=>{

        let spaceId;

        const response = await axios.post(`${BACKEND_URL}/api/space`,{
            "name": "Test",
          "dimensions": "100x200",
          "mapId": mapId
       },{
        headers:{
            authorization:`Bearer ${userToken}`
        }
       })

       spaceId = response.spaceId;

       expect(spaceId).toBeDefined();

    })

    test("User creates a space without mapId(Empty space)",async ()=>{

        let spaceId;

        const response = await axios.post(`${BACKEND_URL}/api/space`,{
            "name": "Test",
          "dimensions": "100x200",
       },{
        headers:{
            authorization:`Bearer ${userToken}`
        }
       })

       spaceId = response.spaceId;

       expect(spaceId).toBeDefined();

    })
    
    test("User fails to creates a space without mapId(Empty space) and dimensions",async ()=>{

        let spaceId;

        const response = await axios.post(`${BACKEND_URL}/api/space`,{
            "name": "Test",
       },{
        headers:{
            authorization:`Bearer ${userToken}`
        }
       })

       spaceId = response.spaceId;

       expect(response.status).toBe(400);

    })
    test("User fails to delete a space that does not exist",async ()=>{


        const response = await axios.delete(`${BACKEND_URL}/api/space`,{
            headers:{
                authorization:`Bearer ${userToken}`
            }
           })

       expect(response.status).toBe(400);

    })

    test("User successfully deletes a space that does exist",async ()=>{
        
        let spaceId;

       const response = await axios.post(`${BACKEND_URL}/api/space`,{
            "name": "Test",
       },{
        headers:{
            authorization:`Bearer ${userToken}`
        }
       })
       spaceId=response.data.spaceId

        const deletedResponse = await axios.delete(`${BACKEND_URL}/api/space/${spaceId}`,{
            headers:{
                authorization:`Bearer ${userToken}`
            }
           })

       expect(deletedResponse.status).toBe(200);

    })

    test("User can not delete someone else's space",async ()=>{
        
        let spaceId;

        const response = await axios.post(`${BACKEND_URL}/api/space`,{
             "name": "Test",
        },{
         headers:{
             authorization:`Bearer ${userToken}`
         }
        })
        spaceId=response.data.spaceId
 
         const deletedResponse = await axios.delete(`${BACKEND_URL}/api/space/${spaceId}`,{
             headers:{
                 authorization:`Bearer ${adminToken}`
             }
            })
 
        expect(deletedResponse.status).toBe(403);


    })

    test("Admin does not have any space created initially",async () =>{

        const response = await axios.get(`${BACKEND_URL}/api/space/all`,{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        })

        expect(response.data.spaces.length).toBe(0)
    })

    test("Lists out all the spaces created by user",async () =>{

        const spaceCreationResponse = await axios.post(`${BACKEND_URL}/api/space`,{
            "name": "Test",
          "dimensions": "100x200",
          "mapId": mapId
       },{
        headers:{
            authorization:`Bearer ${userToken}`
        }
       })
       const response = await axios.get(`${BACKEND_URL}/api/space/all`,{
        headers:{
            authorization:`Bearer ${userToken}`
        }
       })

       const filteredResponse = response.data.spaces.find(x=> x.id == spaceCreationResponse.spaceId)
       expect(response.data.spaces.length).not.toBe(0);
       expect(filteredResponse).toBeDefined();
       
    })


})