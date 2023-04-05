function chatbot(previousQuestionsAndAnswers, newQuestion) {
    // Build the messages
    var messages = [
      {
        role: "assistant",
        content:
          "You're an AI assistant for a website that sells courses on how to use chat GPT to make personalized workout and weight loss plans. The two courses you promote are one for the perfect workout plan and the other for the perfect weight loss plan. You can provide advice on which course they should buy and how AI-made personalized workout plans will help them get in shape and save money. If you are unable to provide an answer to a question, please respond with the phrase 'I'm just a simple gymbro, I can't help with that'.",
      },
    ];
  
    // Add the previous questions and answers
    for (
      var i = Math.max(0, previousQuestionsAndAnswers.length - 10);
      i < previousQuestionsAndAnswers.length;
      i++
    ) {
      var question = previousQuestionsAndAnswers[i][0];
      var answer = previousQuestionsAndAnswers[i][1];
      messages.push({ role: "user", content: question });
      messages.push({ role: "assistant", content: answer });
    }
  
    // Add the new question
    messages.push({ role: "user", content: newQuestion });
  
    // Call the OpenAI API
    fetch("https://api.openai.com/v1/engines/text-davinci-002/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + "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",
      },
      body: JSON.stringify({
        prompt: messages
          .map((message) => message.role + ": " + message.content)
          .join("\n"),
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract the chatbot's response from the API response
        var chatbotResponse = data.choices[0].text;
  
        // Add the chatbot's response to the messages
        messages.push({ role: "assistant", content: chatbotResponse });
  
        // Add the new question and chatbot response to the previous questions and answers
        previousQuestionsAndAnswers.push([newQuestion, chatbotResponse]);
  
        // Add the chat messages to the chatbox
        var chatbox = document.getElementById("chatbox");
        messages.forEach(function (message) {
          var div = document.createElement("div");
          div.classList.add("chat-" + message.role);
          div.textContent = message.content;
          chatbox.appendChild(div);
        });
  
        // Scroll the chatbox to the bottom
        chatbox.scrollTop = chatbox.scrollHeight;
      })
      .catch((error) => {
        console.error("Error calling OpenAI API:", error);
      });
  }
  
