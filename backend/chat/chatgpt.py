# # import openai 

# from openai import OpenAI
# client = OpenAI(api_key='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'
# )



# messages=[
#     {"role":"system","content":"You are a helpful assistant."},
# ]

# while True:
#     message=input("You:")
#     if message:
#         messages.append(
#             {"role":"user","content":message},
#         )
#         chat=client.chat.completions.create(
#             model="gpt-3.5-turbo-instruct",messages=messages
#         )
#         # openai.ChatCompletion.create(
#         #     model="gpt-3.5-turbo",messages=messages
#         # )

#         reply=chat['choices'][0]['message']['content']
#         print(f"Friend {reply}")
#         messages.append({"role":"assistant","content":reply})