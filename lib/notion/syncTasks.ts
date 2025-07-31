import { notion } from './client'

export async function syncTasksToNotion(tasks: Array<{
  title: string
  description?: string
  status: 'To Do' | 'In Progress' | 'Review' | 'Done'
  due_date?: string
}>, databaseId: string) {
  const pagePromises = tasks.map(task =>
    notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: task.title,
              },
            },
          ],
        },
        Status: {
          select: {
            name: task.status,
          },
        },
        'Due Date': task.due_date
          ? {
              date: {
                start: task.due_date,
              },
            }
          : undefined,
      },
      children: task.description
        ? [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                text: [
                  {
                    type: 'text',
                    text: {
                      content: task.description,
                    },
                  },
                ],
              },
            },
          ]
        : [],
    })
  )

  return await Promise.all(pagePromises)
}
