import React from 'react'

function FormBlog() {
  return (
    <>
    <div>FormBlog</div>
    <form>
      <label>
        Name:
        <input type="text" name="name" />
      </label>
      <input type="submit" value="Submit" />
    </form>
    </>
  )
}

export default FormBlog