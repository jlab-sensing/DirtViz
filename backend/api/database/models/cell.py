from ..models import db
from .user import User


class Cell(db.Model):
    """Table of cells"""

    __tablename__ = "cell"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text(), nullable=False, unique=True)
    location = db.Column(db.Text())
    latitude = db.Column(db.Float())
    longitude = db.Column(db.Float())
    archive = db.Column(db.Boolean(), default=False, nullable=False)
    user_id = db.Column(db.Uuid(), db.ForeignKey("user.id"))

    user = db.relationship("User", backref="cell")

    def __repr__(self):
        return repr(self.name)
    
    @staticmethod
    def add_cell_by_user_email(name, location, latitude, longitude, archive, userEmail
    ):
        # check for existing cell name -> notify user that cell name already exists
        user_id = User.get_user_by_email(userEmail).id
        new_cell = Cell(
            name=name,
            location=location,
            latitude=latitude,
            longitude=longitude,
            user_id=user_id,
            archive=archive,
        )
        new_cell.save()
        return new_cell

    @staticmethod
    def get(id):
        return Cell.query.filter_by(id=id).first()

    @classmethod
    def get_all(cell):
        cell.query.all()

    def save(self):
        db.session.add(self)
        db.session.commit()
