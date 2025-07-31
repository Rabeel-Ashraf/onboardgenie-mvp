export const generateQuestionsPrompt = (serviceType: string) => \`
You are an expert client onboarding specialist for creative agencies.
Generate exactly 8–10 smart questions for a "\${serviceType}" project.

Return as JSON array with: id (string), type ("text"|"file"|"multiple_choice"|"boolean"), question (string), helpText? (string), options? (string[]), required (boolean)

Include branding, content, technical access, design, timeline.

Example:
[{
  "id": "brand-colors",
  "type": "text",
  "question": "What are your brand’s primary colors?",
  "helpText": "Please provide hex codes.",
  "required": true
}]

Now generate:
\`.trim()
