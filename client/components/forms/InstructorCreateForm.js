import { Button, Avatar, Badge } from "antd";

const InstructorCreateForm = ({
    handleSubmit,
    handleImage,
    handleChange,
    values,
    setValues,
    preview,
    uploadButtonText,
    handleImageRemove = (f) => f,
    editPage = false,
}) => {
    return (
        <>
            {
                values &&
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                             type="text"
                             name="name"
                             className="form-control"
                             placeholder="Name"
                             value={values.name}
                             onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                             type="email"
                             name="email"
                             className="form-control"
                             placeholder="Email"
                             value={values.email}
                             onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                             type="password"
                             name="password"
                             className="form-control"
                             placeholder="Password"
                             value={values.password}
                             onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="age"
                            className="form-control"
                            placeholder="Age"
                            value={values.age}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="country"
                            className="form-control"
                            placeholder="Country"
                            value={values.country}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <div className="col">
                            <div className="form-group">
                                <label className="btn btn-outline-secondary btn-block text-left">
                                {uploadButtonText}
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleImage}
                                    accept="image/*"
                                    hidden
                                />
                                </label>
                            </div>
                        </div>
      
                        {preview &&  (
                        <Badge 
                            count='X'
                            onClick={handleImageRemove}
                            className='pointer'
                        >
                            <Avatar width={200} src={preview}/>
                        </Badge>
                        )}
            
                        {editPage && values.image && <Avatar width={200} src={values.image.Location}/>}
                    </div>  
                    <div className="form-row">
            <div className="col">
              <Button
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                className="btn btn-primary"
                loading={values.loading}
                type="primary"
                size="large"
                shape="round"
              >
                {values.loading ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </div>
                </form>
            }
        </>
    )
}

export default InstructorCreateForm